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
    2. `cd app-template/common && npm run watch`
    3. `cd app-template/server && npm run build && npm run dev`
    4. `cd app-template/ui && npm run build`
4. Open localhost:3000 in browser