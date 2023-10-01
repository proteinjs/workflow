import React, { ReactElement } from 'react'
import { Box } from '@mui/material'

export type NestedDataTree<T> = T | Array<NestedDataTree<T>>
export type NestedElements = NestedDataTree<ReactElement>
type NestedListProps = { items: NestedElements[], level?: number }
const blue = '#1976d2';
const green = '#76d275';
const orange = '#ffa726';
const purple = '#ab47bc';
const colors = [blue, green, orange, purple];

export const NestedList = ({ items, level }: NestedListProps) => {
  const isRoot = typeof level === 'undefined';
  const resolvedLevel = level ? level : 0;
  return (
    <Box 
      component='ul' 
      sx={{ 
        padding: isRoot ? 0 : undefined,
        margin: isRoot ? 0 : undefined,
      }}
    >
      {
        items.map((item, index) => (Array.isArray(item)) ?
          <NestedList 
            key={index} 
            items={item} 
            level={resolvedLevel + 1} 
          />
          :
          <Box
            key={index}
            component='li'
            sx={(theme) => ({
              borderLeft: 3,
              borderLeftColor: colors[resolvedLevel%colors.length],
              listStyleType: 'none',
              paddingLeft: theme.spacing(1),
            })}
          >
            {item}
          </Box>
        )
      }
    </Box>
  );
}