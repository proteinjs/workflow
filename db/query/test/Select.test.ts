import { QueryBuilder } from '../src/QueryBuilder';

describe('QueryBuilder - Select tests', () => {
  interface Employee {
    id: number;
    name: string;
    age: number;
    country: string;
  }

  const dbName = 'test';
  const tableName = 'Employee';

  test('Select *', () => {
    const queryObject = {
      name: 'John Doe',
      country: 'USA'
    };

    const qb = QueryBuilder.fromObject<Employee>(queryObject, tableName);

    // Standard SQL output
    let result = qb.toSql({dbName});
    const expectedSQL = "SELECT * FROM test.Employee WHERE name = 'John Doe' AND country = 'USA';";
    expect(result.sql).toBe(expectedSQL);

    // SQL output with positional parameters
    result = qb.toSql({ dbName, useParams: true });
    expect(result.sql).toContain("SELECT * FROM test.Employee WHERE name = ? AND country = ?;");
    expect(result.params).toEqual(['John Doe', 'USA']);

    // SQL output with named parameters and types
    result = qb.toSql({ dbName, useParams: true, useNamedParams: true });
    expect(result.sql).toContain("SELECT * FROM test.Employee WHERE name = @param0 AND country = @param1;");
    expect(result.namedParams?.params).toEqual({ param0: 'John Doe', param1: 'USA' });
    expect(result.namedParams?.types).toEqual({ param0: 'string', param1: 'string' });
  });

  test('Select name, age', () => {
    const queryObject = {
      name: 'John Doe',
      country: 'USA'
    };

    const qb = QueryBuilder.fromObject<Employee>(queryObject, tableName).select({ fields: ['name', 'age'] });

    // Standard SQL output
    let result = qb.toSql({dbName});
    const expectedSQL = "SELECT name, age FROM test.Employee WHERE name = 'John Doe' AND country = 'USA';";
    expect(result.sql).toBe(expectedSQL);

    // SQL output with positional parameters
    result = qb.toSql({ dbName, useParams: true });
    expect(result.sql).toContain("SELECT name, age FROM test.Employee WHERE name = ? AND country = ?;");
    expect(result.params).toEqual(['John Doe', 'USA']);

    // SQL output with named parameters and types
    result = qb.toSql({ dbName, useParams: true, useNamedParams: true });
    expect(result.sql).toContain("SELECT name, age FROM test.Employee WHERE name = @param0 AND country = @param1;");
    expect(result.namedParams?.params).toEqual({ param0: 'John Doe', param1: 'USA' });
    expect(result.namedParams?.types).toEqual({ param0: 'string', param1: 'string' });
  });

  test('Select name, age', () => {
    const qb = new QueryBuilder(tableName).select({ indexes: true });

    // Standard SQL output
    let result = qb.toSql({dbName});
    const expectedSQL = "SHOW INDEX FROM test.Employee;";
    expect(result.sql).toBe(expectedSQL);

    // SQL output with positional parameters
    result = qb.toSql({ dbName, useParams: true });
    expect(result.sql).toContain("SHOW INDEX FROM test.Employee;");
    expect(result.params).toEqual([]);

    // SQL output with named parameters and types
    result = qb.toSql({ dbName, useParams: true, useNamedParams: true });
    expect(result.sql).toContain("SHOW INDEX FROM test.Employee;");
    expect(result.namedParams?.params).toEqual({});
    expect(result.namedParams?.types).toEqual({});
  });
});