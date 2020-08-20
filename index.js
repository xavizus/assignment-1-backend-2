require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const todoRout = require('./routes/todoRoute');
const path = require('path');
require('./database/mongodb');
/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(express.static('./public'));
app.use('/scripts',express.static(path.join(__dirname + '/node_modules/vue/dist')));

app.use('/api/v1', todoRout);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

let server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports.app = app;
module.exports.server = server;