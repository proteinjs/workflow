import { QueryBuilder, ParameterizationConfig } from './QueryBuilder';

export interface Statement {
  sql: string;
  params?: any[]; // For Knex
  namedParams?: { // For Spanner
    params: Record<string, any>;
    types: Record<string, string>;
  };
}

export class StatementFactory<T> {
  insert(tableName: string, data: Partial<T>, config?: ParameterizationConfig): Statement {
    const paramManager = new StatementParamManager(config);
    const props = Object.keys(data);
    const values = props.map(prop => paramManager.parameterize(data[prop as keyof T], typeof data[prop as keyof T]));
    const sql = `INSERT INTO ${tableName} (${props.join(', ')}) VALUES (${values.join(', ')});`;
    return { sql, ...paramManager.getParams() };
  }

  update(tableName: string, data: Partial<T>, queryBuilder: QueryBuilder<T>, config?: ParameterizationConfig): Statement {
    const paramManager = new StatementParamManager(config);
    const props = Object.keys(data);
    const setClauses = props
      .map(prop => `${prop} = ${paramManager.parameterize(data[prop as keyof T], typeof data[prop as keyof T])}`)
      .join(', ')
    ;
    const whereClause = queryBuilder.toWhereClause(config, paramManager);
    const sql = `UPDATE ${tableName} SET ${setClauses} ${whereClause.sql};`;
    return { sql, ...paramManager.getParams() };
  }

  delete(tableName: string, queryBuilder: QueryBuilder<T>, config?: ParameterizationConfig): Statement {
    const paramManager = new StatementParamManager(config);
    const whereClause = queryBuilder.toWhereClause(config, paramManager);
    const sql = `DELETE FROM ${tableName} ${whereClause.sql};`;
    return { sql, ...paramManager.getParams() };
  }
}

export class StatementParamManager {
  private params: any[] = [];
  private paramNames: Record<string, any> = {};
  private paramTypes: Record<string, string> = {};
  private paramCounter = 0;

  constructor(private config?: ParameterizationConfig) {}

  /**
   * Process and parameterize values (ie. condition values), including handling subqueries
  */
  parameterize(value: any, valueType: string): string {
    if (value instanceof QueryBuilder) {
      // Generate SQL for the subquery
      const subQuery = value.toSql(this.config);
      if (this.config?.useParams) {
        if (this.config.useNamedParams && subQuery.namedParams) {
          // Merge parameters and types from subquery
          for (let key of Object.keys(subQuery.namedParams.params)) {
            const paramName = `param${this.paramCounter++}`;
            this.paramNames[paramName] = subQuery.namedParams.params[key];
            this.paramTypes[paramName] = subQuery.namedParams.types[key];
          }
          return `(${subQuery.sql.slice(0, -1)})`; // Remove the trailing semicolon from subquery SQL
        } else if (subQuery.params) {
          // Append parameters from subquery
          this.params.push(...subQuery.params);
        }
      }
      return `(${subQuery.sql.slice(0, -1)})`; // Subquery SQL for non-parameterized config
    } else if (this.config?.useParams) {
      if (this.config.useNamedParams) {
        const paramName = `param${this.paramCounter++}`;
        this.paramNames[paramName] = value;
        this.paramTypes[paramName] = valueType;
        return `@${paramName}`;
      } else {
        this.params.push(value);
        return '?';
      }
    } else {
      // Direct value formatting for non-parameterized queries
      return typeof value === 'string' ? `'${value}'` : String(value);
    }
  }

  getParams(): { 
    params?: any[],
    namedParams?: {
      params: Record<string, any>,
      types: Record<string, string>,
    }
  } {
    if (this.config?.useParams) {
      if (this.config.useNamedParams) {
        return { namedParams: { params: this.paramNames, types: this.paramTypes } };
      } else {
        return { params: this.params };
      }
    }

    return {};
  }
}