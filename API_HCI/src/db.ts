import { DataSource } from "typeorm";

export const testDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts']
});

export default new DataSource({
  type: 'sqlite',
  database: 'src/db/init.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts']
});