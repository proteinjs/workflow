import { QueryBuilder } from '../src/QueryBuilder';

describe('QueryBuilder - GROUP BY Functionality', () => {
  interface Employee {
    id: number;
    name: string;
    age: number;
    department: string;
    salary: number;
    yearsOfService: number;
  }

  const tableName = 'Employee';

  test('Basic GROUP BY', () => {
    const qb = new QueryBuilder<Employee>(tableName).addGroupBy(['department']);
    expect(qb.toSql()).toBe('SELECT * FROM Employee GROUP BY department;');
  });

  test('GROUP BY with condition', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addCondition({ field: 'age', operator: '>', value: 30 })
      .addGroupBy(['department']);
    expect(qb.toSql()).toBe("SELECT * FROM Employee WHERE age > 30 GROUP BY department;");
  });

  test('GROUP BY with aggregate function', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addAggregate({ function: 'AVG', field: 'salary' })
      .addGroupBy(['department']);
    expect(qb.toSql()).toBe('SELECT AVG(salary) FROM Employee GROUP BY department;');
  });

  test('Multiple GROUP BY fields', () => {
    const qb = new QueryBuilder<Employee>(tableName).addGroupBy(['department', 'age']);
    expect(qb.toSql()).toBe('SELECT * FROM Employee GROUP BY department, age;');
  });

  test('GROUP BY with multiple aggregate functions', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addAggregate({ function: 'MAX', field: 'salary' })
      .addAggregate({ function: 'MIN', field: 'age' })
      .addGroupBy(['department']);
    expect(qb.toSql()).toBe('SELECT MAX(salary), MIN(age) FROM Employee GROUP BY department;');
  });

  test('GROUP BY with aggregate function and condition', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addCondition({ field: 'department', operator: '=', value: 'Engineering' })
      .addAggregate({ function: 'COUNT', field: 'id' })
      .addGroupBy(['age']);
    expect(qb.toSql()).toBe("SELECT COUNT(id) FROM Employee WHERE department = 'Engineering' GROUP BY age;");
  });

  test('GROUP BY with multiple fields', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addAggregate({ function: 'AVG', field: 'salary' })
      .addGroupBy(['department', 'age']);
    expect(qb.toSql()).toBe('SELECT AVG(salary) FROM Employee GROUP BY department, age;');
  });

  test('GROUP BY with logical group condition', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addLogicalGroup('AND', [
        { field: 'age', operator: '>', value: 30 },
        { field: 'yearsOfService', operator: '<', value: 10 }
      ])
      .addAggregate({ function: 'SUM', field: 'salary' })
      .addGroupBy(['department']);
    expect(qb.toSql()).toBe("SELECT SUM(salary) FROM Employee WHERE (age > 30 AND yearsOfService < 10) GROUP BY department;");
  });

  test('Complex GROUP BY with multiple conditions and aggregates', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .addCondition({ field: 'department', operator: '=', value: 'Engineering' })
      .addLogicalGroup('OR', [
        { field: 'age', operator: '>', value: 50 },
        { field: 'yearsOfService', operator: '>=', value: 20 }
      ])
      .addAggregate({ function: 'COUNT', field: 'id' })
      .addAggregate({ function: 'AVG', field: 'salary' })
      .addGroupBy(['department', 'age']);
    expect(qb.toSql()).toBe("SELECT COUNT(id), AVG(salary) FROM Employee WHERE department = 'Engineering' AND (age > 50 OR yearsOfService >= 20) GROUP BY department, age;");
  });
});
