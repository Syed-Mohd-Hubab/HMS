const mysql = require("mysql2/promise")
const configDB = require("./configDB")
const connection = mysql.createPool(configDB.connection)

module.exports = connection