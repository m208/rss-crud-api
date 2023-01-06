# Assignment: CRUD API

## How to start

- Clone this repository
- Switch to 'dev' branch
- Run `npm install` command
- Run one of the following commands:
  - `npm run start:dev` Start app in development mode (Auto restarting app on code changes)
  - `npm run start:prod` Start app in production mode (Compiling JS bundle in 'build' directory)
  - `npm run start:multi` Start app in horizontal scaling mode
  - `npm run test` Start auto tests
- Use [Postman](https://web.postman.co/) to send requests to local server

## Endpoints

API Link is `localhost:4000/api/users`

- GET `api/users` is used to get all persons
- GET `api/users/${userId}` is used to get existing person
- POST `api/users` is used to create record about new user and store it in database
- PUT `api/users/{userId}` is used to update existing user
- DELETE `api/users/${userId}` is used to delete existing user from database

## Post body format

Post and Put requests data should match scheme

All fields are required

```
{
    username: string
    age: number
    hobbies: Array<string>
}
```

## Horizontal scaling mode

Command `npm run start:multi` starts multiple instances of app (equal to the number of logical processor cores on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them.

The databases of each instance are syncronised by sending messages worker-master, master-workers.

Use Postman to send requests to `localhost:4000/api/users` and they will be redirected to other ports.

Postman also can be used to post data directly on any of `localhost:400X` ports in use. With a consistent database, data for other instances will be up-to-date.

## Auto tests

Implemented three scenarios of testing:

- Basic CRUD operations
- Error handlings
- Post data validation

Tests covers only single instance app, not 'multi' version

## Dependencies

Used dependencies: `typescript`, `ts-node`, `nodemon`, `dotenv`, `uuid`

Used testing libraries: `supertest`, `jest`, `ts-jest`
