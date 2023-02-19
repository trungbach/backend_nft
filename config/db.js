'user strict';

var mysql = require('mysql2');
require("dotenv").config();
//local mysql db connection
var connection = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
});
// connect to database
// connection.connect(function(err) {
//     if (err) throw err;
// });

module.exports = connection;
