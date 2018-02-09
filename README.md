# Test task
A task that was given to me by a company to apply for a position.

## Installation:
1. `npm install`
2. `npm start`

## Environment variables:
1. PORT - sets port on witch server to be listening on. Default 3000
2. HOST - sets host on witch server will be working on. Default localhost
3. PG_CONNECTION_URL - postgres database connection url (https://jdbc.postgresql.org/documentation/80/connect.html)
4. DOTENV_PATH - patch to .env file (https://www.npmjs.com/package/dotenv) [You can set env variables throught this file]. When runing tests you can set same variable to point to different file for tests.
5. NODE_ENV - node environment. When running on production needs to be set to "production". In other cases provides extra information (stack trace) on error responses.

## Available routes:
1. `GET /user` - replies with 200 status code and json all the users found in table
2. `GET /user/:login` - replies with 200 and json user if found or error 'No such user' otherwise
3. `POST /user` - creates new user. Body parameters: `login`, `email`, `name` and `age`. Relies with 200 and json new user created or error if login already taken by other user.
4. `PUT /user/:login` - modifies the existing user. Body parameters: `email`, `name` and `age`. Replies with 200 and json modified user if found or error 'No such user' otherwise
5. Any unmached rout - replies with 404 and json body with error `Not Found`.
6. If error occurs - replies with 500 and json body with error message.

* Body can be send with Content-Type: `application/json` or `application/x-www-form-urlencoded`
