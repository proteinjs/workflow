import React from 'react'
import { FormPage, Page, PageComponentProps } from '@proteinjs/ui'
import { tableByName } from '@proteinjs/db';
import { RecordTable } from '../table/RecordTable';

export const rootThoughtsPage: Page = {
  name: 'Record Table',
  path: 'record/table',
  component: ({...props}) => (
    <FormPage>
      <DynamicRecordTable {...props} />
    </FormPage>
  )
}

const DynamicRecordTable = ({ urlParams }: PageComponentProps) => {
  function Table() {
    const tableName = urlParams['name'];
    let table;
    let error;
    if (tableName) {
      try {
        table = tableByName(tableName);
      } catch (error) {
        error = `Table not accessible in UI: ${tableName}`;
      }
    } else {
      error = `Table not provided via the 'name' url param`;
    }

    if (!table) {
      return <div>{ error }</div>;
    }

    return (
      <RecordTable
        table={table}
      />
    );
  }

  return (
    <Table />
  );
}