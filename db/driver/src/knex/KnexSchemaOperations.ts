import * as knex from 'knex';
import { Logger } from '@brentbahry/util';
import { Column, Table } from '@proteinjs/db';
import { SchemaOperations, TableChanges } from '@proteinjs/db/src/schema/Schema';
import { KnexDriver } from './KnexDriver';
import { getColumnFactory } from './getColumnFactory';

export class KnexSchemaOperations implements SchemaOperations {
  private logger = new Logger(this.constructor.name);

  constructor(
    private knexDriver: KnexDriver
  ){}

  async createTable(table: Table<any>) {
    let resolve: any;
    let reject: any;
    const p = new Promise<void>((rs, rj) => {
      resolve = rs;
      reject = rj;
    });
  
    await this.knexDriver.getKnex().schema.withSchema(this.knexDriver.getDbName()).createTable(table.name, (tableBuilder: knex.TableBuilder) => {
      for (const columnPropertyName in table.columns) {
        const column = table.columns[columnPropertyName];
        this.createColumn(column, table, tableBuilder);
        this.logger.info(`[${table.name}] Created column: ${column.name}`);
      }
  
      if (table.primaryKey) {
        tableBuilder.primary(table.primaryKey as string[]);
        this.logger.info(`[${table.name}] Created primary key: ${table.primaryKey}`);
      }
  
      if (table.indexes) {
        for (const index of table.indexes) {
          const columnNames = index.columns.map((columnPropertyName) => table.columns[columnPropertyName as string].name)
          tableBuilder.index(columnNames, index.name);
          this.logger.info(`[${table.name}] Created index: ${columnNames}`);
        }
      }
    }).catch((reason: any) => {
      reject(`Failed to create table: ${table.name}. reason: ${reason}`);
    }).then(() => {
      resolve();
    });
  
    return p;
  }

  private createColumn(column: Column<any, any>, table: Table<any>, tableBuilder: knex.TableBuilder, tableChanges?: TableChanges) {
    const logger = new Logger('KnexSchemaManager.createColumn');
    const columnFactory = getColumnFactory(column);
    const columnBuilder = columnFactory.create(column, tableBuilder);
    if (column.options?.unique?.unique && (!tableChanges || tableChanges.columnsWithUniqueConstraintsToCreate.includes(column.name))) {
      columnBuilder.unique(column.options.unique.indexName);
      logger.info(`[${table.name}.${column.name}] Added unique constraint`);
    }
  
    if (column.options?.references && (!tableChanges || tableChanges.columnsWithForeignKeysToCreate.includes(column.name))) {
      columnBuilder.references(column.options.references.column).inTable(`${this.knexDriver.getDbName()}.${column.options.references.table}`);
      logger.info(`[${table.name}.${column.name}] Added foreign key -> ${column.options.references.table}.${column.options.references.column}`);
    }
  
    if (typeof column.options?.nullable !== 'undefined') {
      if (column.options?.nullable)
        columnBuilder.nullable();
      else
        columnBuilder.notNullable();
  
      logger.info(`[${table.name}.${column.name}] Added constraint nullable: ${column.options?.nullable}`);
    }
  
    return columnBuilder;
  }

  async alterTable(table: Table<any>, tableChanges: TableChanges) {
		let resolve: any;
		let reject: any;
		const p = new Promise<void>((rs, rj) => {
			resolve = rs;
			reject = rj;
		});
			
		await this.knexDriver.getKnex().schema.withSchema(this.knexDriver.getDbName()).table(table.name, (tableBuilder: knex.TableBuilder) => {
			for (const columnPropertyName of tableChanges.columnsToCreate) {
				const column = table.columns[columnPropertyName];
				this.createColumn(column, table, tableBuilder, tableChanges);
				this.logger.info(`[${table.name}] Created column: ${column.name}`);
			}
	
			for (const column of tableChanges.columnsWithUniqueConstraintsToDrop) {
				tableBuilder.dropUnique([column]);
				this.logger.info(`[${table.name}.${column}] Dropped unique constraint`);
			}
	
			for (const column of tableChanges.columnsWithForeignKeysToDrop) {
				tableBuilder.dropForeign([column]);
				this.logger.info(`[${table.name}.${column}] Dropped foreign key`);
			}
	
			for (const index of tableChanges.indexesToDrop) {
				tableBuilder.dropIndex(index);
				this.logger.info(`[${table.name}] Dropped index: ${index}`);
			}
	
			for (const columnPropertyName of tableChanges.columnsToAlter) {
				const column = table.columns[columnPropertyName];
				this.createColumn(column, table, tableBuilder, tableChanges).alter();
				this.logger.info(`[${table.name}.${column.name}] Altered column, type: ${column.type}`);
			}
	
			for (const columnPropertyName of tableChanges.columnsToRename) {
				const column = table.columns[columnPropertyName];
				if (!column.oldName)
					continue;
	
				tableBuilder.renameColumn(column.oldName, column.name);
				this.logger.info(`[${table.name}] Renamed column: ${column.oldName} -> ${column.name}`);
			}
	
			if (tableChanges.dropExistingPrimaryKey) {
				tableBuilder.dropPrimary();
				this.logger.info(`[${table.name}] Dropped primary key: ${tableChanges.existingPrimaryKey}`);
			}
	
			if (tableChanges.createPrimaryKey) {
				tableBuilder.primary(table.primaryKey as string[]);
				this.logger.info(`[${table.name}] Created primary key: ${table.primaryKey}`);
			}
	
			for (const index of tableChanges.indexesToCreate) {
				tableBuilder.index(index);
				this.logger.info(`[${table.name}] Created index: ${index}`);
			}
		}).catch((reason: any) => {
			reject(`Failed to alter table: ${table.name}. reason: ${reason}`);
		}).then(() => {
      resolve();
    });
	
		return p;
	}
}