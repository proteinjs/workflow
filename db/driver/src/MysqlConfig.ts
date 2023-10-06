import { Loadable, SourceRepository } from '@brentbahry/reflection';

export const getMysqlConfig = () => {
  const config = SourceRepository.get().object<MysqlConfig>('@proteinjs/db-driver/MysqlConfig');
  return Object.assign({
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    user: process.env.DB_USER ? process.env.DB_USER : 'root',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '',
    dbName: process.env.DB_NAME ? process.env.DB_NAME : 'dev',
  }, config);
}

export type MysqlConfig = Loadable & {
  host?: string,
  user?: string,
  password?: string,
  dbName?: string,
}