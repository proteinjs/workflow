import { Logger } from '@brentbahry/util';
import { Method } from '@brentbahry/reflection';
import { Table } from '../Table';
import { TableAuth } from './TableAuth';

export class TableServiceAuth {
  private logger = new Logger(this.constructor.name);

  canAccess(method: Method, args: any[]): boolean {
    try {
      const table: Table<any>|undefined = args[0];
      if (!(table instanceof Table))
        throw new Error(`[DbServiceAuth] Expected first arg to be a table`);
      
      const tableAuth = new TableAuth();
      if (method.name === 'get' || method.name == 'query' || method.name == 'getRowCount')
        tableAuth.canQuery(table, 'service');
      else if (method.name === 'insert')
        tableAuth.canInsert(table, 'service');
      else if (method.name === 'update')
        tableAuth.canUpdate(table, 'service');
      else if (method.name === 'delete')
        tableAuth.canDelete(table, 'service');
      else
        throw new Error(`User is not authorized to access unsupported Db service api: ${method.name}`);
    } catch (error: any) {
      this.logger.error(error.stack);
      return false;
    }

    return true;
  }
}