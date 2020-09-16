/**
 * Database connection
 */

const mongoose = require('mongoose');

let mongodb;

switch(process.env.ENVIRONMENT) {
    case "TEST":
        const {MongoMemoryServer} = require('mongodb-memory-server');
        mongodb = new MongoMemoryServer();
        break;
    case "DEVELOPMENT":
    case "PRODUCTION":
    case "STAGING":
        let auth = '';
        if (process.env.DBUSER && process.env.DBPASSWORD) {
            auth = `${process.env.DBUSER}:${process.env.DBPASSWORD}@`
        }
        let tls = (process.env.DBTLS.toLowerCase() == 'true')? '+srv' : ''
        mongodb = {
            getUri: async () =>
                `mongodb${tls}://${auth}${process.env.DBHOST}:/${process.env.DATABASE}`
        }
        break;
    default:
        throw new Error(`${process.env.ENVIRONMENT} is not a valid environment!`)
}



async function connect() {
    let uri = await mongodb.getUri();
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    if (!mongoose.connection) {
        throw new MongooseError("Could not connect to database!");
    }
}

async function disconnect() {
    try {
        await mongoose.connection.close(() => {
            console.log('Database connection closed')
        });
        if(process.env.ENVIRONMENT == 'TEST'){
            await mongodb.stop()
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {connect, disconnect};