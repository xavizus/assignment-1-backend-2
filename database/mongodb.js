/**
 * Database connection
 */
const mongoose = require('mongoose');
let auth;
if (process.env.USER && process.env.PASSWORD) {
    auth = `${process.env.USER}:${process.env.PASSWORD}@`
}
const uri = `mongodb+srv://${auth}${process.env.HOST}:/${process.env.DATABASE}`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
if (!mongoose.connection) {
    throw new MongooseError("Could not connect to database!");
}