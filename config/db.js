'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Hson_0707',
    database : 'marketplace'
});
// connect to database
connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;