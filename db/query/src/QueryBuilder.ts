const graphlib = require('@dagrejs/graphlib');

export type LogicalOperator = 'AND' | 'OR';
export type Operator = '=' | '<>' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'LIKE' | 'BETWEEN' | 'IS NULL' | 'IS NOT NULL' | 'NOT';
export type AggregateFunction = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

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

interface ParameterizationConfig {
  useParams?: boolean; // Enable parameterization
  useNamedParams?: boolean; // Use named parameters (for Spanner), otherwise use '?' (for Knex)
}

interface Query {
  sql: string;
  params?: any[]; // For Knex
  namedParams?: { // For Spanner
    params: Record<string, any>;
    types: Record<string, string>;
  };
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

  toSql(config?: ParameterizationConfig): Query {
    let sql = 'SELECT ';
    const aggregates: string[] = [];
    let groupBys: string[] = [];
    const params: any[] = [];
    const namedParams: Query['namedParams'] = {
      params: {},
      types: {}
    };
    let paramCounter = 0; // Counter for parameter names

    // Function to process and parameterize values
    const parameterizeValue = (value: any, valueType: string): string => {
      if (config?.useParams) {
        if (config.useNamedParams) {
          const paramName = `param${paramCounter++}`;
          namedParams.params[paramName] = value;
          namedParams.types[paramName] = valueType;
          return `@${paramName}`;
        } else {
          params.push(value);
          return '?';
        }
      } else {
        return typeof value === 'string' ? `'${value}'` : String(value);
      }
    };

    // Define a recursive function to process nodes and build condition strings
    const processNode = (nodeId: string): string => {
      const node: any = this.graph.node(nodeId); // Assuming node has a specific structure based on the node type
      switch (node.type) {
        case 'CONDITION':
          if (node.operator === 'IN') {
            let valuesStr = Array.isArray(node.value) ? node.value.map((val: any) => parameterizeValue(val, typeof val)).join(', ') : parameterizeValue(node.value, typeof node.value);
            return `${node.field} ${node.operator} (${valuesStr})`;
          } else if (node.operator === 'BETWEEN') {
            // Ensure BETWEEN values are provided as an array of two elements
            let valuesStr = Array.isArray(node.value) ? node.value.map((val: any) => parameterizeValue(val, typeof val)).join(' AND ') : parameterizeValue(node.value, typeof node.value);
            return `${node.field} ${node.operator} ${valuesStr}`;
          } else if (node.operator === 'IS NULL' || node.operator === 'IS NOT NULL') {
            return `${node.field} ${node.operator}`;
          } else {
            const conditionValue = parameterizeValue(node.value, typeof node.value);
            return `${node.field} ${node.operator} ${conditionValue}`;
          }
        case 'LOGICAL':
          const childIds: string[] = this.graph.successors(nodeId);
          const childConditions: string[] = childIds.map(processNode).filter(cond => cond !== '');
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

    // Start processing from the root node
    const rootChildren: string[] = this.graph.successors(this.rootId);
    const whereClauses: string[] = rootChildren.map(processNode).filter(clause => clause !== '');
    const whereClause: string = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    sql += aggregates.length > 0 ? aggregates.join(', ') : '*';
    sql += ` FROM ${this.tableName}`;
    sql += whereClause;

    if (groupBys.length > 0) {
      sql += ` GROUP BY ${groupBys.join(', ')}`;
    }

    sql = sql.trim() + ';';
    
    if (config?.useParams) {
      if (config.useNamedParams) {
        return { sql, namedParams };
      } else {
        return { sql, params };
      }
    }
    
    return { sql };
  }
}