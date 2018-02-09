require('dotenv').config({
    path: process.env.DOTENV_PATH || ''
});
const express = require('express');
const bodyParser = require('body-parser');
const UserModel = require('./models/User');
const UserController = require('./controllers/User');
const createUserRouter = require('./routers/User');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userController = new UserController(UserModel);
const userRouter = createUserRouter(express.Router, userController);
app.use('/user/', userRouter);

app.use((error, req, res, next) => {
    const reply = { error: error.message };
    if (process.env.NODE_ENV !== 'production') {
        reply.stack = error.stack;
    }
    res.status(500).json(reply);
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
