import { Db } from './Db';
import { Record } from './Record';
import { Table } from './Table';

export class ReferenceArray<T extends Record> {
  private objects: T[]|undefined;

  constructor(
    private table: Table<T>,
    private ids: string[],
  ) {}

  async get(): Promise<T[]> {
    if (!this.objects)
      this.objects = await Db.query(this.table, [{ column: 'id', operator: 'in', value: this.ids }]);

    return this.objects;
  }

  async set(objects: Promise<T[]>) {
    this.objects = await objects;
  }
}