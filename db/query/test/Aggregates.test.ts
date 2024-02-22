import { QueryBuilder } from '../src/QueryBuilder';

describe('QueryBuilder - Aggregate Support', () => {
  interface TestEntity {
    id: number;
    name: string;
    age: number;
    salary: number;
  }

  const tableName = 'TestEntity';

  test('COUNT aggregate function', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addAggregate({ function: 'COUNT', field: 'id' });
    expect(qb.toSql()).toBe('SELECT COUNT(id) FROM TestEntity;');
  });

  test('SUM aggregate function', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addAggregate({ function: 'SUM', field: 'salary' });
    expect(qb.toSql()).toBe('SELECT SUM(salary) FROM TestEntity;');
  });

  test('AVG aggregate function', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addAggregate({ function: 'AVG', field: 'age' });
    expect(qb.toSql()).toBe('SELECT AVG(age) FROM TestEntity;');
  });

  test('MIN aggregate function', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addAggregate({ function: 'MIN', field: 'age' });
    expect(qb.toSql()).toBe('SELECT MIN(age) FROM TestEntity;');
  });

  test('MAX aggregate function', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addAggregate({ function: 'MAX', field: 'age' });
    expect(qb.toSql()).toBe('SELECT MAX(age) FROM TestEntity;');
  });

  test('Multiple aggregate functions', () => {
    const qb = new QueryBuilder<TestEntity>(tableName)
      .addAggregate({ function: 'COUNT', field: 'id' })
      .addAggregate({ function: 'AVG', field: 'age' });
    expect(qb.toSql()).toBe('SELECT COUNT(id), AVG(age) FROM TestEntity;');
  });

  test('Aggregate function with condition', () => {
    const qb = new QueryBuilder<TestEntity>(tableName)
      .addCondition({ field: 'age', operator: '>', value: 30 })
      .addAggregate({ function: 'AVG', field: 'salary' });
    expect(qb.toSql()).toBe("SELECT AVG(salary) FROM TestEntity WHERE age > 30;");
  });

  test('Aggregate function with GROUP BY', () => {
    const qb = new QueryBuilder<TestEntity>(tableName)
      .addAggregate({ function: 'SUM', field: 'salary' })
      .addGroupBy(['age']);
    expect(qb.toSql()).toBe("SELECT SUM(salary) FROM TestEntity GROUP BY age;");
  });
});
