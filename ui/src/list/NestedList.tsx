import React, { ReactElement } from 'react'
import { Box } from '@mui/material'

export type NestedListItem = { element: ReactElement, children?: NestedListItem[] }
type NestedListProps = { items: NestedListItem[], level?: number, levelColors?: string[] }
const blue = '#1976d2';
const green = '#76d275';
const orange = '#ffa726';
const purple = '#ab47bc';
const defaultLevelColors = [blue, green, orange, purple];

export const NestedList = ({ items, level, levelColors }: NestedListProps) => {
  const isRoot = typeof level === 'undefined';
  const resolvedLevel = level ? level : 0;
  const resolvedLevelColors = levelColors ? levelColors : defaultLevelColors;
  const flattenedItems = flattenItems(items);

  function flattenItems(items: NestedListItem[]): (NestedListItem|NestedListItem[])[] {
    const flattened = [];
    for (let item of items) {
      flattened.push(item);
      if (item.children)
        flattened.push(item.children);
    }

    return flattened;
  }

  return (
    <Box 
      component='ul' 
      sx={{ 
        padding: isRoot ? 0 : undefined,
        margin: isRoot ? 0 : undefined,
      }}
    >
      {
        flattenedItems.map((item, index) => (Array.isArray(item)) ?
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
              borderLeftColor: resolvedLevelColors[resolvedLevel%resolvedLevelColors.length],
              listStyleType: 'none',
              paddingLeft: theme.spacing(1),
            })}
          >
            {item.element}
          </Box>
        )
      }
    </Box>
  );
}