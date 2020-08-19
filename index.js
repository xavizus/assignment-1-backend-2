require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

/**
 * Middleware
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

let server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports.app = app;
module.exports.server = server;