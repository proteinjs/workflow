import { ParameterizationConfig } from '@proteinjs/db-query';
import { Table, tableByName } from './Table';

export class StatementConfigFactory {
  private dbName: string;
  private getTable: (tableName: string) => Table<any>;

  constructor(
    dbName: string,
    getTable?: (tableName: string) => Table<any>
  ) {
    this.dbName = dbName;
    this.getTable = getTable ? getTable : tableByName;
  }

  getStatementConfig(parameterizationConfig: ParameterizationConfig) {
    return {
        dbName: this.dbName,
        resolveFieldName: this.getResolveFieldName(),
        ...parameterizationConfig
    };
  }

  private getResolveFieldName() {
      return (tableName: string, propertyName: string): string => {
        const table = this.getTable(tableName);
        const column = table.columns[propertyName];
        if (!column)
          throw new Error(`(${table.name}) Column does not exist for property: ${propertyName}`);

        return column.name;
      }
  }
}