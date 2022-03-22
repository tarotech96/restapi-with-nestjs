# Building Restfull API with NestJs

### Setup

  - Install nestjs-cli
  - Create new project by using nestjs-cli command line
  - Create modules, services, validation file...vv

    For create new module
      nest g module module_name

    For create new service
      nest g service service_name
  
  - Setup database by using docker
  - Use prisma library to create ORM and connect to database
  - Handle registry and login methods
  - Config app with ConfigModule
  - Authenticate by using nestjs/passport passport passport-local
  - Custom decorator, guard...
  - Use pactumJS for testing


### Bash

Run app on dev environment
```
  yarn start dev
```

Run docker container and connect to database
```
  docker-compose up -d
  npx prisma migrate dev
```
or shorthand
```
  yarn db:dev:restart (for dev environment)
  yarn db:test:restart (for test environment)
```

Stop and delete container
```
  docker-compose down
```

Run test
```
  yarn test:e2e
```

