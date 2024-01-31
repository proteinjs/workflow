# Setup

1. Setup Protein JS components monorepo
    1. `git clone git@github.com:brentbahry/components.git`
    2. `cd components && ./setup.sh`
2. Setup local mysql server
    1. Install docker
    2. Create and start mysql container: `docker run -p 127.0.0.1:3306:3306  --name mdb -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=TRUE -d mariadb:latest`
    3. (optional) Connect to mysql cli: `docker exec -it mdb mariadb --user root`
3. Setup app-template project
    1. `git clone git@github.com:brentbahry/app-template.git`
    2. `cd app-template/common && npm i && npm run watch`
    3. `cd app-template/ui && npm i && npm run watch`
    4. `cd app-template/server && npm i && npm run build && npm run dev`
4. Open http://localhost:3000 in browser

# Example usage

1. Tables
    1. An example table is created in app-template-common
    2. Since app-template-ui and app-template-server depend on @proteinjs/db-ui and @proteinjs/db-driver respectively, you get a base set of table and form components for free for any table table created with the @proteinjs/db/Table api
        1. Open http://localhost:3000/tables in browser
        2. Click on the table named `example`
        3. You've been navigated to the table ui for this table, where all its records are listed
        4. If you click `+` you will be navigated to the form to create a record in that table
        5. After creating the record, the form will enable you to update or delete the record
        6. Once there are records in the table, the table component enables you to delete records as well with the multi-select action
    3. The components behind these db pages can be used programmatically by importing things like `RecordForm` and `RecordTable` from the @proteinjs/db-ui package