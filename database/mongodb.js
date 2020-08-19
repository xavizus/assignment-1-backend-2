/**
 * Database connection
 */
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DATABASE}`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
if (!mongoose.connection) {
    throw new MongooseError("Could not connect to database!");
}