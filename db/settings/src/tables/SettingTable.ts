import { Table, StringColumn, Record, withRecordColumns, ObjectColumn } from '@proteinjs/db';

export interface Setting extends Record {
	name: string;
  value: any;
}

export class SettingTable extends Table<Setting> {
	public name = 'setting';
	public columns = withRecordColumns<Setting>({
    name: new StringColumn('name'),
    value: new ObjectColumn('value'),
	});
};
