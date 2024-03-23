import { Logger } from '@brentbahry/util';
import { Table, SchemaOperations, TableChanges, StatementFactory, AlterTableParams } from '@proteinjs/db';
import { SpannerDriver } from './SpannerDriver';
import { SpannerColumnTypeFactory } from './SpannerColumnTypeFactory';

export class SpannerSchemaOperations implements SchemaOperations {
  private logger = new Logger(this.constructor.name);

  constructor(
    private spannerDriver: SpannerDriver
  ){}

  async createTable(table: Table<any>) {
    const indexes: { name?: string, columns: string|string[], unique?: boolean }[] = [];
    for (let index of table.indexes) {
      indexes.push({ name: index.name, columns: index.columns as string[] });
    }

    const serializedColumns: { name: string, type: string, nullable?: boolean }[] = [];
    const foreignKeys: { table: string, column: string, referencedByColumn: string }[] = [];
    for (const columnPropertyName in table.columns) {
      const column = table.columns[columnPropertyName];
      const columnType = new SpannerColumnTypeFactory().getType(column);
      serializedColumns.push({ name: column.name, type: columnType, nullable: column.options?.nullable });
      this.logger.info(`[${table.name}] Creating column: ${column.name} (${column.constructor.name})`)
      if (column.options?.unique?.unique) {
        indexes.push({ name: column.options.unique.indexName, columns: column.name, unique: true });
        this.logger.info(`[${table.name}.${column.name}] Adding unique constraint`);
      }
  
      if (column.options?.references) {
        foreignKeys.push({ table: column.options.references.table, column: column.options.references.column, referencedByColumn: column.name });
        this.logger.info(`[${table.name}.${column.name}] Adding foreign key -> ${column.options.references.table}.${column.options.references.column}`);
      }
    }
    const createTableSql = new StatementFactory().createTable(table.name, serializedColumns, table.primaryKey as string[]).sql;
    await this.spannerDriver.runUpdateSchema(createTableSql);

    for (let index of indexes) {
      const createIndexSql = new StatementFactory().createIndex(index, table.name).sql;
      this.logger.info(`[${table.name}] Creating index: ${index.name}`);
      await this.spannerDriver.runUpdateSchema(createIndexSql);
      this.logger.info(`[${table.name}] Created index: ${index.name}`);
    }
  }

  async alterTable(table: Table<any>, tableChanges: TableChanges) {
    const params: AlterTableParams = {
      tableName: table.name,
      columnsToAdd: [],
      foreignKeysToDrop: [],
      foreignKeysToAdd: [],
      columnTypeChanges: [],
      columnRenames: [],
      dropPrimaryKey: false,
    };
    const indexesToDrop = tableChanges.indexesToDrop;
    const indexesToAdd = tableChanges.indexesToCreate;
		for (const columnPropertyName of tableChanges.columnsToCreate) {
      const column = table.columns[columnPropertyName];
      const columnType = new SpannerColumnTypeFactory().getType(column);
      params.columnsToAdd?.push({ name: column.name, type: columnType, nullable: column.options?.nullable });
      this.logger.info(`[${table.name}] Creating column: ${column.name} (${column.constructor.name})`);
      if (column.options?.unique?.unique && tableChanges.columnsWithUniqueConstraintsToCreate.includes(column.name)) {
        indexesToAdd.push({ name: column.options.unique.indexName, columns: column.name, unique: true });
        this.logger.info(`[${table.name}.${column.name}] Adding unique constraint`);
      }
  
      if (column.options?.references && tableChanges.columnsWithForeignKeysToCreate.includes(column.name)) {
        params.foreignKeysToAdd?.push({ table: column.options.references.table, column: column.options.references.column, referencedByColumn: column.name });
        this.logger.info(`[${table.name}.${column.name}] Adding foreign key -> ${column.options.references.table}.${column.options.references.column}`);
      }
    }

    for (const columnName of tableChanges.columnsWithUniqueConstraintsToDrop) {
      indexesToDrop.push({ columns: columnName, unique: true });
      this.logger.info(`[${table.name}.${columnName}] Dropping unique constraint`);
    }

    for (const foreignKey of tableChanges.foreignKeysToDrop) {
      params.foreignKeysToDrop?.push(foreignKey);
      this.logger.info(`[${table.name}.${foreignKey.referencedByColumn}] Dropping foreign key -> ${foreignKey.table}.${foreignKey.column}`);
    }

    for (const columnTypeChange of tableChanges.columnTypeChanges) {
      params.columnTypeChanges?.push(columnTypeChange);
      this.logger.info(`[${table.name}.${columnTypeChange.name}] Changing column type to: ${columnTypeChange.newType}`);
    }

    for (const columnNullableChange of tableChanges.columnNullableChanges) {
      params.columnNullableChanges?.push(columnNullableChange);
      this.logger.info(`[${table.name}.${columnNullableChange.name}] Updating nullable constraint to: ${columnNullableChange.nullable === true}`);
    }

    for (const columnPropertyName of tableChanges.columnsToRename) {
      const column = table.columns[columnPropertyName];
      if (!column.oldName)
        continue;

      params.columnRenames.push({ currentName: column.oldName, newName: column.name });
      this.logger.info(`[${table.name}] Renaming column: ${column.oldName} -> ${column.name}`);
    }

    if (tableChanges.dropExistingPrimaryKey) {
      params.dropPrimaryKey = tableChanges.dropExistingPrimaryKey;
      this.logger.info(`[${table.name}] Dropping primary key: ${tableChanges.existingPrimaryKey}`);
    }

    if (tableChanges.createPrimaryKey) {
      params.primaryKeyToCreate = (table.primaryKey as string[]);
      this.logger.info(`[${table.name}] Creating primary key: ${table.primaryKey}`);
    }

    for (let index of tableChanges.indexesToDrop) {
      const dropIndexSql = new StatementFactory().dropIndex(index, table.name).sql;
      this.logger.info(`[${table.name}] Dropping index: ${index.name}`);
      await this.spannerDriver.runUpdateSchema(dropIndexSql);
      this.logger.info(`[${table.name}] Dropped index: ${index.name}`);
    }

    for (let index of tableChanges.indexesToCreate) {
      const createIndexSql = new StatementFactory().dropIndex(index, table.name).sql;
      this.logger.info(`[${table.name}] Creating index: ${index.name}`);
      await this.spannerDriver.runUpdateSchema(createIndexSql);
      this.logger.info(`[${table.name}] Created index: ${index.name}`);
    }
	}
}