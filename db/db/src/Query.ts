import { Record } from './Record';
import { Table } from './Table';

export type Query<T> = ObjectQuery<T> | QueryCondition<T>[]
export type ObjectQuery<T> = Partial<{ [P in keyof T]: any }>
export type QueryCondition<T> = { column: keyof T, operator: Operator, value: any }
export type SerializedQuery = ColumnQuery|SerializedQueryCondition[];
export type SerializedQueryCondition = { column: string, operator: Operator, value: any }
export type ColumnQuery = {[key: string]: any}
export type Operator = ComparisonOperator | 'in';
export type ComparisonOperator = '=' | '>' | '>=' | '<' | '<=' | '<>';

export class QuerySerializer<T extends Record> {
  private table: Table<T>;
  
	constructor(table: Table<T>) {
    this.table = table;
  }

  serializeQuery(query: Query<T>) {
    if (Array.isArray(query)) {
      const serializedQueryConditions = [];
      for (let queryCondition of query)
        serializedQueryConditions.push(this.serializeQueryCondition(queryCondition));

      return serializedQueryConditions;
    }
    
    const columnQuery: ColumnQuery = {};
    for (let prop in query) {
      const column = (this.table.columns as any)[prop];
      if (!column)
        throw new Error(`Failed to serialize columnQuery, column does not exist: ${prop}`);

      columnQuery[column.name] = query[prop];
    }
    return columnQuery;
  }

  private serializeQueryCondition(queryCondition: QueryCondition<T>): SerializedQueryCondition|void {
    const serializedQueryCondition: SerializedQueryCondition = { column: '', operator: queryCondition.operator, value: queryCondition.value };
    const column = (this.table.columns as any)[queryCondition.column];
    if (!column)
      throw new Error(`Failed to serialize queryCondition, column does not exist: ${queryCondition.column as string}`);

    serializedQueryCondition.column = column.name;
    return serializedQueryCondition;
  }
}