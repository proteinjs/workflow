export type RowWindow<T> = {
  rows: T[],
  totalCount: number,
}

export type TableLoader<T> = {
  load: (startIndex: number, endIndex: number) => Promise<RowWindow<T>>,
}