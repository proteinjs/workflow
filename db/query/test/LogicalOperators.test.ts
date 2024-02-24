import { QueryBuilder } from '../src/QueryBuilder';

describe('QueryBuilder - Logical Operator Support', () => {
  interface Employee {
    id: number;
    name: string;
    age: number;
    salary: number;
    department: string;
  }

  const tableName = 'Employee';

  test('logicalGroup - Complex triple nested logical operations with aggregates', () => {
    const qb = new QueryBuilder<Employee>(tableName)
      .logicalGroup('AND', [
        {
          operator: 'OR',
          children: [
            {
              operator: 'AND',
              children: [
                { field: 'department', operator: '=', value: 'Engineering' },
                { field: 'name', operator: 'LIKE', value: '%John%' },
              ],
            },
            { field: 'department', operator: '=', value: 'Product' },
          ],
        },
        {
          operator: 'AND',
          children: [
            { field: 'age', operator: '>', value: 30 },
            { field: 'age', operator: '<', value: 50 },
          ],
        },
        {
          operator: 'OR',
          children: [
            { field: 'salary', operator: '>', value: 50000 },
            { field: 'salary', operator: '<=', value: 100000 },
          ],
        },
      ])
      .aggregate({ function: 'MAX', field: 'age' })
      .groupBy(['department']);
  
    // Standard SQL output
    expect(qb.toSql().sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = 'Engineering' AND name LIKE '%John%') OR department = 'Product') AND (age > 30 AND age < 50) AND (salary > 50000 OR salary <= 100000)) GROUP BY department;");
  
    // SQL output with positional parameters
    let result = qb.toSql({ useParams: true });
    expect(result.sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = ? AND name LIKE ?) OR department = ?) AND (age > ? AND age < ?) AND (salary > ? OR salary <= ?)) GROUP BY department;");
    expect(result.params).toEqual(['Engineering', '%John%', 'Product', 30, 50, 50000, 100000]);
  
    // SQL output with named parameters and types
    result = qb.toSql({ useParams: true, useNamedParams: true });
    expect(result.sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = @param0 AND name LIKE @param1) OR department = @param2) AND (age > @param3 AND age < @param4) AND (salary > @param5 OR salary <= @param6)) GROUP BY department;");
    expect(result.namedParams?.params).toEqual({ param0: 'Engineering', param1: '%John%', param2: 'Product', param3: 30, param4: 50, param5: 50000, param6: 100000 });
    expect(result.namedParams?.types).toEqual({ param0: 'string', param1: 'string', param2: 'string', param3: 'number', param4: 'number', param5: 'number', param6: 'number' });
  });  

  test('and/or - Complex triple nested logical operations with aggregates', () => {
    const qb = new QueryBuilder<Employee>(tableName);
    qb.and([
        qb.or([
          qb.and([
            { field: 'department', operator: '=', value: 'Engineering' },
            { field: 'name', operator: 'LIKE', value: '%John%' }
          ]),
          { field: 'department', operator: '=', value: 'Product' }
        ]),
        qb.and([
          { field: 'age', operator: '>', value: 30 },
          { field: 'age', operator: '<', value: 50 }
        ]),
        qb.or([
          { field: 'salary', operator: '>', value: 50000 },
          { field: 'salary', operator: '<=', value: 100000 }
        ])
      ])
      .aggregate({ function: 'MAX', field: 'age' })
      .groupBy(['department']);
  
    // Standard SQL output
    let result = qb.toSql();
    expect(result.sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = 'Engineering' AND name LIKE '%John%') OR department = 'Product') AND (age > 30 AND age < 50) AND (salary > 50000 OR salary <= 100000)) GROUP BY department;");
  
    // SQL output with positional parameters
    result = qb.toSql({ useParams: true });
    expect(result.sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = ? AND name LIKE ?) OR department = ?) AND (age > ? AND age < ?) AND (salary > ? OR salary <= ?)) GROUP BY department;");
    expect(result.params).toEqual(['Engineering', '%John%', 'Product', 30, 50, 50000, 100000]);
  
    // SQL output with named parameters and types
    result = qb.toSql({ useParams: true, useNamedParams: true });
    expect(result.sql).toBe("SELECT MAX(age) FROM Employee WHERE (((department = @param0 AND name LIKE @param1) OR department = @param2) AND (age > @param3 AND age < @param4) AND (salary > @param5 OR salary <= @param6)) GROUP BY department;");
    expect(result.namedParams?.params).toEqual({ param0: 'Engineering', param1: '%John%', param2: 'Product', param3: 30, param4: 50, param5: 50000, param6: 100000 });
    expect(result.namedParams?.types).toEqual({ param0: 'string', param1: 'string', param2: 'string', param3: 'number', param4: 'number', param5: 'number', param6: 'number' });
  });  
});
