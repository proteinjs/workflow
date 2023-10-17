import { CustomSerializableObject } from '@proteinjs/serializer';
import { Db } from './Db';
import { Record } from './Record';
import { tableByName } from './Table';
import { ReferenceArraySerializerId } from './serializers/ReferenceArraySerializer';

/**
 * All instance members are internal state, made public for ReferenceArraySerializer.
 * Only get() and set() should be used.
 */
export class ReferenceArray<T extends Record> implements CustomSerializableObject {
  public __serializerId = ReferenceArraySerializerId;

  constructor(
    public _table: string,
    public _ids: string[],
    public _objects?: T[],
  ) {}

  async get(): Promise<T[]> {
    if (!this._objects) {
      if (this._ids.length < 1) {
        this._objects = [];
      } else {
        const table = tableByName(this._table);
        this._objects = await new Db().query(table, [{ column: 'id', operator: 'in', value: this._ids }]);
      }
    }

    return this._objects;
  }

  set(objects: T[]) {
    this._objects = objects;
  }
}