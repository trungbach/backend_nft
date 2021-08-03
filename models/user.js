'user strict';
var sql = require('../config/db.js');

//Category object constructor
var User = function (user) {
    console.log(user);
    this.nonce = user.nonce;
    this.public_address = user.public_address;
    this.username = user.username;
};
User.createUser = function createUser(newCategory, result) {
    sql.query("INSERT INTO users set ?", newCategory, function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log("insertId", res.insertId)
            result(null, res.insertId);
        }
    });
};
User.findById = function findById(id, result) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from users where id = ? ", id, function (err, res) {
            return err ? reject(err) : resolve(res[0]);
        }
        );
    });
};
User.findByAddress = function findByAddress(address) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from users where public_address = ? ", address, function (err, res) {
            return err ? reject(err) : resolve(res[0]);
        }
        );
    });
};
User.getAllUser = function getAllUser(result) {
    sql.query("Select * from users", function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
User.updateById = function (id, user, result) {
    sql.query("UPDATE users SET nonce = ? WHERE id = ?", [user.nonce, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

module.exports = User;