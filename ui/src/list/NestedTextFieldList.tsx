// import React from 'react'
// import { TextField } from '@mui/material'
// import { NestedList } from './NestedList'

// export type ListItem = {  }
// type NestedTextFieldListProps = { element: ReactElement, children?: NestedListItem[] }

// export const NestedTextFieldList = ({ items }: NestedMutableListProps) => {
//   return (
//     <NestedList items={wrap(items)} />
//   );
// }

// function wrap(items: NestedMutableListProps['items']): NestedElements[] {
//   return items.map(item => Array.isArray(item) ? wrap(item) : <MutableListItem item={item} />);
// }

// const MutableListItem = ({ item }: { item: string }) => {
//   const [value, setValue] = React.useState(item);

//   return (
//     <TextField
//       sx={{
//         display: 'flex',
//         flexWrap: 'nowrap',
//       }}
//       variant='standard'
//       value={value}
//       onChange={event => setValue(event.target.value)}
//     />
//   );
// }