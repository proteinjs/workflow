import { Table } from './Table';
import { Session } from '../table/Session';

export function getTables(): Table[] {
  const tables: Table[] = [
    new Session(),
    // Add other tables here
  ];

  return tables;
}