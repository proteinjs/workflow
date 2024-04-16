# Overview

Protein JS is an app framework, written in TypeScript, leveraging Node and React. It's relatively modular and aims to be opt-in as much as possible, while also providing a range of components types: from minimal-dependency utilities to stateful, full-stack features. For example, you could depend on just @proteinjs/conversation to leverage APIs for interacting with chat bots. Or, you could depend on most packages and consume DB services with their corresponding UI components and build your own.

The direction of Protein JS is to be a simple set of tools to build scalable and maintainable apps as we transition into the AI era.

The project is currently in beta, and can be used by building from source via the setup instructions below. Packages will be published as the project matures.

Current goals:

1. Add additional infra support (db drivers, ai chatbot drivers, cloud ops utils)
2. Stabilize with automated testing and production use
3. Onboard interested devs

# Setup

1. Setup the Protein JS components monorepo
    1. `git clone git@github.com:proteinjs/components.git`
    2. `cd components && ./setup.sh`
2. Setup a local mysql server
    1. Install docker
    2. Create and start mysql container: `docker run -p 127.0.0.1:3306:3306  --name mdb -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=TRUE -d mariadb:latest`
    3. (optional) Connect to mysql cli: `docker exec -it mdb mariadb --user root`
3. Setup the app-template project
    1. `git clone git@github.com:proteinjs/app-template.git`
    2. `cd app-template/common && npm i && npm run watch`
    3. Open a new terminal tab and run: `cd app-template/ui && npm i && npm run watch`
    4. Open a new terminal tab and run: `cd app-template/server && npm i && npm run watch`
    5. Open a new terminal tab and run: `cd app-template/server && npm run dev`
        1. The watch build in the previous window will re-build the app-template-server package as you make changes. To get those changes into the running server, kill the server in this terminal with `ctrl+c` and then run `npm run dev` again to start it with the latest build
        2. The server watches the app-template-ui package, creates incremental builds, and ships down hot updates to the browser automatically. The reason for the watch process in the app-template-ui package is for compiler error checking; the incrememtal build in the server just transpiles for performance. Compiler errors should show up in your editor regardless of these watch processes.
4. Open http://localhost:3000 in a browser

# Example usage

1. Tables
    1. An example table is created in app-template-common
    2. Since app-template-ui and app-template-server depend on @proteinjs/db-ui and @proteinjs/db-driver-knex respectively, you get a base set of table and form components for free for any table created with the @proteinjs/db/Table api
        1. Open http://localhost:3000/tables in a browser
        2. Click on the table named `example`
        3. You've been navigated to the table ui for this table, where all its records are listed
        4. If you click `+` you will be navigated to the form to create a record in that table
        5. After creating the record, the form will enable you to update or delete the record
        6. Once there are records in the table, the table component enables you to delete records as well with the multi-select action
    3. The components behind these db pages can be used programmatically by importing things like `RecordForm` and `RecordTable` from the @proteinjs/db-ui package