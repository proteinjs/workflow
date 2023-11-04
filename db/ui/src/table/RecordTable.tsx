import React from 'react'
import { Delete, Add } from '@mui/icons-material'
import S from 'string'
import { TableButton, Table as TableComponent, TableLoader, TableProps } from '@proteinjs/ui'
import { Column, Record, ReferenceArrayColumn, Table, getDbService } from '@proteinjs/db'
import { QueryTableLoader } from './QueryTableLoader'
import { newRecordFormLink, recordFormLink } from '../pages/RecordFormPage'
import { recordTableLink } from '../pages/RecordTablePage'

export type RecordTableProps<T extends Record> = {
  table: Table<T>,
  tableLoader?: TableLoader<T>,
  title?: TableProps<T>['title'],
  description?: TableProps<T>['description'],
  columns?: TableProps<T>['columns'],
  defaultRowsPerPage?: TableProps<T>['defaultRowsPerPage'],
  buttons?: TableProps<T>['buttons'],
  rowOnClickRedirectUrl?: TableProps<T>['rowOnClickRedirectUrl'],
}

function deleteButton<T extends Record>(table: Table<T>): TableButton<T> {
  return {
    name: `Delete selected rows`,
    icon: Delete,
    visibility: {
      showWhenRowsSelected: true,
      showWhenNoRowsSelected: false,
    },
    onClick: async (selectedRows, navigate) => {
      await getDbService().delete(table, [{ column: 'id', operator: 'in', value: selectedRows.map(row => row.id) }]);
      navigate(recordTableLink(table));
    },
  };
}

function createButton<T extends Record>(table: Table<T>): TableButton<T> {
  return {
    name: `Create ${S(table.name).humanize().s}`,
    icon: Add,
    visibility: {
      showWhenRowsSelected: false,
      showWhenNoRowsSelected: true,
    },
    onClick: async (selectedRows, navigate) => {
      navigate(newRecordFormLink(table.name));
    },
  };
}

export function RecordTable<T extends Record>(props: RecordTableProps<T>) {
  function defaultColumns() {
    const columnProperties: (keyof T)[] = [];
    if ((props.table.columns as any)['name'])
      columnProperties.push('name' as keyof T);

    for (let columnProperty of Object.keys(props.table.columns)) {
      if (columnProperties.length >= 5)
        break;

      if (columnProperty == 'name' || columnProperty == 'id' || columnProperty == 'created' || columnProperty == 'updated' || columnProperty == 'password')
        continue;

      const column: Column<T, any> = (props.table.columns as any)[columnProperty];
      if (column.type == 'longtext' || column instanceof ReferenceArrayColumn)
        continue;

      columnProperties.push(columnProperty as keyof T);
    }

    columnProperties.push('created');
    columnProperties.push('updated');

    return columnProperties;
  }

  function defaultTableLoader() {
    return new QueryTableLoader(props.table, undefined, [{ column: 'updated', desc: true }]);
  }

  async function defaultRowOnClickRedirectUrl(row: T) {
    return recordFormLink(props.table.name, row.id);
  }

  function buttons() {
    const buttons: TableButton<T>[] = [];
    if (props.buttons)
      buttons.push(...props.buttons);

    buttons.push(deleteButton(props.table));
    buttons.push(createButton(props.table));

    return buttons;
  }
  
  return (
    <TableComponent
      title={props.title ? props.title : `${S(props.table.name).humanize().toString()} Table`}
      description={props.description}
      columns={props.columns ? props.columns : defaultColumns()}
      tableLoader={props.tableLoader ? props.tableLoader : defaultTableLoader()}
      rowOnClickRedirectUrl={props.rowOnClickRedirectUrl ? props.rowOnClickRedirectUrl : defaultRowOnClickRedirectUrl}
      defaultRowsPerPage={props.defaultRowsPerPage}
      buttons={buttons()}
    />
  );
}
