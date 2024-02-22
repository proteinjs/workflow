import { QueryBuilder } from '../src/QueryBuilder';

describe('QueryBuilder - Basic Operator Support', () => {
  interface TestEntity {
    id: number;
    name: string;
    age: number;
    country: string;
  }

  const tableName = 'TestEntity';

  test('= operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'id', operator: '=', value: 1 });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE id = 1;");
  });

  test('<> and != operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'name', operator: '<>', value: 'John' });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE name <> 'John';");

    const qb2 = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'name', operator: '!=', value: 'John' });
    expect(qb2.toSql()).toBe("SELECT * FROM TestEntity WHERE name != 'John';");
  });

  test('> operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'age', operator: '>', value: 18 });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE age > 18;");
  });

  test('< operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'age', operator: '<', value: 65 });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE age < 65;");
  });

  test('>= operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'age', operator: '>=', value: 18 });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE age >= 18;");
  });

  test('<= operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'age', operator: '<=', value: 65 });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE age <= 65;");
  });

  test('IN operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'id', operator: 'IN', value: [1, 2, 3] });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE id IN (1, 2, 3);");
  });

  test('LIKE operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'name', operator: 'LIKE', value: '%John%' });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE name LIKE '%John%';");
  });

  test('BETWEEN operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'age', operator: 'BETWEEN', value: [18, 30] });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE age BETWEEN (18, 30);");
  });

  test('IS NULL operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'country', operator: 'IS NULL', value: null });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE country IS NULL;");
  });

  test('IS NOT NULL operator', () => {
    const qb = new QueryBuilder<TestEntity>(tableName).addCondition({ field: 'country', operator: 'IS NOT NULL', value: null });
    expect(qb.toSql()).toBe("SELECT * FROM TestEntity WHERE country IS NOT NULL;");
  });
});
