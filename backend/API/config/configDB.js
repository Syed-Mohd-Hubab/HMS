// configuring configDB.js for connection
const dotenv = require('dotenv')
dotenv.config({ path: './API/config/config.env' })

module.exports = {
    'connection': {
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'password': process.env.DB_PASS,
        'database': process.env.DB_NAME,
        'stringifyObjects': 'Stringify',
    }
};
