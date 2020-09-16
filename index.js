require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const todoItemsRouter = require('./routes/todoItemsRoute');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const todoListRouter = require('./routes/todoListRoute');
const gdprRouter = require('./routes/gdprRoute');
const path = require('path');
const {connect} = require('./database/mongodb');
/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('./public'));

/**
 * Routes
 */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todoItems', todoItemsRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todoLists', todoListRouter);
app.use('/api/v1/gdpr', gdprRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

let server = app.listen(port, async() => {
    await connect();
    console.log(`Listening on port ${port}`);
});

module.exports.app = app;
module.exports.server = server;