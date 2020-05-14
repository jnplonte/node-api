# NODE API
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()


## Version
**v1.0.0**


## Dependencies
* nodejs: [https://nodejs.org/](https://nodejs.org/en/)
* expressjs: [https://expressjs.com/](https://expressjs.com/)
* mysql: [https://mysql.com/](https://mysql.com/)
* docker: [https://www.docker.com/](https://www.docker.com/)


## Demo
* api: [https://www.jnpl.me/playground/nodeapi/](https://www.jnpl.me/playground/nodeapi/)
* api documentation: [https://www.jnpl.me/playground/nodeapi/documentation](https://wwww.jnpl.me/playground/nodeapi/documentation/)


## NODE
### Installation
* Install typescript globally `npm install -g typescript`
* Install npm dependencies by running `npm install`
* Update the following configurations and database credentials on `{root}/node-app/src/config/*-config.json`
* Build typescript by running `npm run build:development`
* Get global config by running `npm run generate:config`
* Generate documentation by running `npm run generate:docs`
* Install database data migraion by running `npm run migrate`
* Install database mock data by running `npm run seed`

### How to Use
* run `npm start` it will listen to http://localhost:8383 with authorization Bearer

### Creating Models and Migrations
* create global models `npm run create:model -- <name of the model>`

### Creating Seeders
* create global seeders `npm run create:seed -- seed-<name of the seeder>`

### Testing
* start all test by running `npm run test`
* start typescript linter `npm run lint`


## DOCKER
### Installation
* build `docker-compose build`
* install node `docker exec -ti node npm install`
* install node `docker exec -ti node npm run generate:config`
* install node `docker exec -ti node npm run generate:docs`

### How to Use
* run `docker-compose up`
* run `docker-compose start`
