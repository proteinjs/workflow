const graphlib = require('@dagrejs/graphlib');

type LogicalOperator = 'AND' | 'OR';
type Operator = '=' | '<>' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'LIKE' | 'BETWEEN' | 'IS NULL' | 'IS NOT NULL' | 'NOT';
type AggregateFunction = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

interface LogicalGroup<T> {
  operator: LogicalOperator;
  children: Array<Condition<T> | LogicalGroup<T>>;
}

interface Condition<T> {
  field: keyof T;
  operator: Operator;
  value: T[keyof T] | T[keyof T][] | QueryBuilder<T> | null;
}

interface Aggregate<T> {
  function: AggregateFunction;
  field: keyof T;
}

export class QueryBuilder<T> {
  private graph: any;
  private idCounter: number = 0;
  private rootId: string = 'root';

  constructor(private tableName?: string) {
    this.graph = new graphlib.Graph({ directed: true });
    this.graph.setNode(this.rootId, { type: 'ROOT' });
  }

  private generateId(): string {
    return `node_${this.idCounter++}`;
  }

  addLogicalGroup(operator: LogicalOperator, elements: Array<Condition<T> | LogicalGroup<T>>, parentId: string = this.rootId): this {
    const groupId = this.generateId();
    this.graph.setNode(groupId, { type: 'LOGICAL', operator, children: [] });
    this.graph.setEdge(parentId, groupId);
  
    elements.forEach((element) => {
      if ('operator' in element && 'children' in element) {
        // Handle nested logical group
        this.addLogicalGroup(element.operator, element.children, groupId);
      } else {
        // Handle condition
        const conditionId = this.generateId();
        this.graph.setNode(conditionId, { ...element, type: 'CONDITION' });
        this.graph.setEdge(groupId, conditionId);
      }
    });
  
    return this;
  }  

  addCondition(condition: Condition<T>, parentId: string = this.rootId): this {
    const conditionId = this.generateId();
    this.graph.setNode(conditionId, { ...condition, type: 'CONDITION' });
    this.graph.setEdge(parentId, conditionId);
    return this;
  }

  addAggregate(aggregate: Aggregate<T>): this {
    const id = this.generateId();
    this.graph.setNode(id, { ...aggregate, type: 'AGGREGATE' });
    this.graph.setEdge(this.rootId, id);
    return this;
  }

  addGroupBy(fields: (keyof T)[]): this {
    const id = this.generateId();
    this.graph.setNode(id, { type: 'GROUP_BY', fields });
    this.graph.setEdge(this.rootId, id);
    return this;
  }

  toSql(): string {
    let query = 'SELECT ';
    const aggregates: string[] = [];
    let groupBys: string[] = [];
  
    // Define a recursive function to process nodes and build condition strings
    const processNode = (nodeId: string): string => {
      const node: any = this.graph.node(nodeId); // Assuming node has a specific structure based on the node type. Replace 'any' with the actual node type if defined.
      switch (node.type) {
        case 'CONDITION':
          if (node.operator === 'IS NULL' || node.operator === 'IS NOT NULL') {
            return `${node.field} ${node.operator}`;
          } else {
            const conditionValue: string = node.value instanceof QueryBuilder ? `(${node.value.toSql()})` :
              Array.isArray(node.value) ? `(${node.value.join(', ')})` :
              typeof node.value === 'string' ? `'${node.value}'` : `${node.value}`;
            return `${node.field} ${node.operator} ${conditionValue}`;
          }
        case 'LOGICAL':
          const childIds: string[] = this.graph.successors(nodeId);
          const childConditions: string[] = childIds.map((childId: string) => processNode(childId)).filter((cond: string) => cond !== '');
          const combinedConditions = childConditions.join(` ${node.operator} `);
          return combinedConditions ? `(${combinedConditions})` : '';
        case 'AGGREGATE':
          aggregates.push(`${node.function}(${String(node.field)})`);
          return '';
        case 'GROUP_BY':
          groupBys.push(...node.fields.map((field: keyof T) => String(field)));
          return '';
        default:
          return '';
      }
    };
  
    // Process each node connected to the root
    const rootChildren: string[] = this.graph.successors(this.rootId);
    const whereClauses: string[] = rootChildren.map((childId: string) => processNode(childId)).filter((clause: string) => clause !== '');
    const whereClause: string = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';
  
    query += aggregates.length > 0 ? aggregates.join(', ') : '*';
    query += ` FROM ${this.tableName}`;
    query += whereClause;
  
    if (groupBys.length > 0) {
      query += ` GROUP BY ${groupBys.join(', ')}`;
    }
  
    return query.trim() + ';';
  }  
}