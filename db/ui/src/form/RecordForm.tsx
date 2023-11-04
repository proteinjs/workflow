import React from 'react'
import S from 'string'
import moment from 'moment'
import { Form, Fields, textField, FormButtons } from '@proteinjs/ui'
import { Table, Record, Column, getDbService, DateTimeColumn, ReferenceArrayColumn, BooleanColumn } from '@proteinjs/db'
import { recordTableLink } from '../pages/RecordTablePage'
import { recordFormLink } from '../pages/RecordFormPage'

export type RecordFormProps<T extends Record> = {
  table: Table<T>,
  record?: T,
}

export function RecordForm<T extends Record>({ table, record }: RecordFormProps<T>) {
  const isNewRecord = typeof record === 'undefined';
  return (
    <Form
      name={S(table.name).humanize().s}
      createFields={createFields()}
      fieldLayout={fieldLayout()}
      buttons={buttons()}
      onLoad={onLoad}
      onLoadProgressMessage={`Loading ${S(table.name).humanize().s}`}
    />
  );

  function getColumns() {
    const columns: {[columnPropertyName: string]: Column<T, any>} = {};
    const nameColumn = (table.columns as any)['name'] as Column<T, any>;
    if (nameColumn)
      columns['name'] = nameColumn;

    for (let columnPropertyName in table.columns) {
      const column = (table.columns as any)[columnPropertyName] as Column<T, any>;
      if (columnPropertyName == 'id' || columnPropertyName == 'name' || columnPropertyName == 'created' || columnPropertyName == 'updated' || columnPropertyName == 'password')
        continue;

      if (column.type == 'longtext' || column instanceof ReferenceArrayColumn)
        continue;

      columns[columnPropertyName] = column;
    }

    if (!isNewRecord) {
      columns['created'] = (table.columns as any)['created'] as Column<T, any>;
      columns['updated'] = (table.columns as any)['updated'] as Column<T, any>;
    }

    return columns;
  }
  
  function createFields(): () => Fields {
    return () => {
      const fields: Fields = {};
      for (let columnPropertyName in getColumns()) {
        const column = (table.columns as any)[columnPropertyName] as Column<T, any>;
        fields[columnPropertyName] = textField({
          name: S(column.name).humanize().s,
        });
      }

      return fields;
    };
  }

  function fieldLayout(): any {
    const columns = getColumns();
    const layoutColumns = Object.entries(columns).length > 7 ? 2 : 1;
    if (layoutColumns > 1) {
      const layout: (keyof T)[][] = [];
      for (let columnPropertyName in columns) {
        if (layout.length == 0 || layout[layout.length - 1].length >= layoutColumns)
          layout.push([]);

        layout[layout.length - 1].push(columnPropertyName as keyof T);
      }

      return layout;
    }

    return Object.keys(columns) as (keyof T)[];
  }

  function buttons(): FormButtons<any> {
    let newRecord: T;
    return {
      delete: {
        name: 'Delete',
        accessibility: {
          hidden: isNewRecord,
        },
        style: {
          color: 'neutral',
          variant: 'plain',
        },
        redirect: async (fields: Fields, buttons: FormButtons<Fields>) => {
          return { path: recordTableLink(table) };
        },
        onClick: async (fields: Fields, buttons: FormButtons<Fields>) => {
          if (!record || !record.id)
            throw new Error(`Unable to delete record, record or id undefined`);

          await getDbService().delete(table, { id: record.id } as any);
          return `Deleted ${S(table.name).humanize().s}`;
        },
        progressMessage: (fields: Fields) => { return `Deleting ${S(table.name).humanize().s}` },
      },
      save: {
        name: 'Save',
        accessibility: {
          hidden: isNewRecord,
        },
        style: {
          color: 'primary',
          variant: 'solid',
        },
        onClick: async (fields: Fields, buttons: FormButtons<Fields>) => {
          if (!record || !record.id)
            throw new Error(`Unable to save record, record or id undefined`);

          for (let columnPropertyName in fields) {
            const field = fields[columnPropertyName];
            (record as any)[columnPropertyName] = field.field.value;
          }

          await getDbService().update(table, record);
          return `Saved ${S(table.name).humanize().s}`;
        },
        progressMessage: (fields: Fields) => { return `Saving ${S(table.name).humanize().s}` },
      },
      create: {
        name: 'Create',
        accessibility: {
          hidden: !isNewRecord,
        },
        style: {
          color: 'primary',
          variant: 'solid',
        },
        redirect: async (fields: Fields, buttons: FormButtons<Fields>) => {
          return { path: recordFormLink(table.name, newRecord.id) };
        },
        onClick: async (fields: Fields, buttons: FormButtons<Fields>) => {
          const record: any = {};
          for (let columnPropertyName in fields) {
            const field = fields[columnPropertyName];
            (record as any)[columnPropertyName] = field.field.value;
          }

          newRecord = await getDbService().insert(table, record);
          return `Created ${S(table.name).humanize().s}`;
        },
        progressMessage: (fields: Fields) => { return `Creating ${S(table.name).humanize().s}` },
      },
    }
  }

  async function onLoad(fields: Fields, buttons: FormButtons<Fields>) {
    if (isNewRecord)
      return;

    for (let columnPropertyName in fields) {
      const column = (table.columns as any)[columnPropertyName] as Column<any, any>;
      const field = fields[columnPropertyName].field;
      let fieldValue = (record as any)[columnPropertyName];
      if (moment.isMoment(fieldValue))
        fieldValue = fieldValue.format('ddd, MMM Do YY, h:mm:ss a');
      else if (column instanceof BooleanColumn)
        fieldValue = fieldValue == true ? 'True' : 'False';
      
      field.value = fieldValue;
      if (
        columnPropertyName == 'created' || 
        columnPropertyName == 'updated' || 
        columnPropertyName == 'id' ||
        column instanceof DateTimeColumn
      ) {
        if (!field.accessibility)
          field.accessibility = {};

        field.accessibility.readonly = true;
      }
    }
  }
}