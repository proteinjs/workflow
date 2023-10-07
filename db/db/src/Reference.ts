import { Db } from './Db';
import { Record } from './Record';
import { tableByName } from './Table';

export class ReferenceArray<T extends Record> {
  private objects: T[]|undefined;

  constructor(
    private table: string,
    private ids: string[],
  ) {}

  async get(): Promise<T[]> {
    if (!this.objects) {
      const table = tableByName(this.table);
      this.objects = await Db.query(table, [{ column: 'id', operator: 'in', value: this.ids }]);
    }

    return this.objects;
  }

  async set(objects: Promise<T[]>) {
    this.objects = await objects;
  }
}