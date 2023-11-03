import React from 'react'

export type TableButton<T> = {
  name: string,
  icon: React.ComponentType,
  visibility: {
    showWhenRowsSelected: boolean,
    showWhenNoRowsSelected: boolean,
  },
  onClick: (selectedRows: T[]) => Promise<void>,
}