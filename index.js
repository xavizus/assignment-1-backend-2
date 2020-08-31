require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const todoRouter = require('./routes/todoRoute');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const path = require('path');
require('./database/mongodb');
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
app.use('/api/v1/todoItems', todoRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

let server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports.app = app;
module.exports.server = server;