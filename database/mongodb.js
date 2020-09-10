/**
 * Database connection
 */
const mongoose = require('mongoose');
let auth = '';
if (process.env.DBUSER && process.env.DBPASSWORD) {
    auth = `${process.env.DBUSER}:${process.env.DBPASSWORD}@`
}
let tls = (process.env.DBTLS.toLowerCase() == 'true')? '+srv' : ''
const uri = `mongodb${tls}://${auth}${process.env.DBHOST}:/${process.env.DATABASE}`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
if (!mongoose.connection) {
    throw new MongooseError("Could not connect to database!");
}

module.exports = {mongoose}