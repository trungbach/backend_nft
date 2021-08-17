'use strict';
var sql = require('../config/db.js');

//Category object constructor
var User = function (user) {
    console.log(user);
    this.nonce = user.nonce;
    this.public_address = user.public_address;
    this.username = user.username;
    this.avatar_id = user.avatar_id;
    this.cover_id = user.cover_id;
};
User.createUser = function createUser(newCategory) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO users set ?", newCategory, function (err, res) {
            return err ? reject(err) : resolve(res.insertId);
        });
    });
};
User.findById = function findById(id) {
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
            return err ? resolve(null) : resolve(res.length > 0 ? res[0] : null);
        });
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
User.updateNonceById = function (id, user) {
    return new Promise((resolve, reject) => {
    sql.query("UPDATE users SET nonce = ? WHERE id = ?", [user.nonce, id], function (err, res) {
        return err ? resolve(null) : resolve(res);
    });
});
};

User.updateProfile = function (id, username, avatar_id, cover_id, description, email) {
    return new Promise((resolve, reject) => {
    sql.query("UPDATE users SET username = ?, avatar_id = ?, cover_id = ?, description = ?, email = ? WHERE id = ?", [username, avatar_id, cover_id, description, email, id], function (err, res) {
        return err ? resolve(null) : resolve(res);
    });
});
};

User.getProfileById = function findById(id) {
    return new Promise((resolve, reject) => {
        sql.query("Select users.*, cover.original_url as cover_url, avatar.original_url as avatar_url, cover.thumb_url as cover_thumb_url, avatar.thumb_url as avatar_thumb_url from users left join files as cover on cover.id = users.cover_id left join files as avatar on avatar.id = users.avatar_id  where users.id = ? ", id, function (err, res) {
            return err ? reject(err) : resolve(res[0]);
        }
        );
    });
};
module.exports = User;