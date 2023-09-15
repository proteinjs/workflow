import { Table } from '../db/Table';

export class Session extends Table {
  name(): string {
    return 'session';
  }

  columns(): { name: string, type: string }[] {
    return [
      { name: 'id', type: 'string' },
      { name: 'created', type: 'string' },
      { name: 'updated', type: 'string' },
      { name: 'sessionId', type: 'string' },
      { name: 'session', type: 'string' }
    ];
  }
}