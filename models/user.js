'use strict';
var sql = require('../config/db.js');

//role
const ADMIN = 0
const USER = 1
//Category object constructor
var User = function (user) {
    console.log(user);
    this.nonce = user.nonce;
    this.public_address = user.public_address;
    this.username = user.username;
    this.avatar_id = user.avatar_id;
    this.cover_id = user.cover_id;
};

User.ADMIN = ADMIN
User.USER = USER

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
User.getAllUser = function getAllUser(params, result) {
    const { start_time, end_time } = params
    sql.query(`Select users.* from users WHERE users.created_at >= '${start_time}' AND users.created_at <= '${end_time}'`, function (err, res) {
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

User.getProfileById = function (id) {
    return new Promise((resolve, reject) => {
        sql.query("Select users.*, cover.original_url as cover_url, avatar.original_url as avatar_url, cover.thumb_url as cover_thumb_url, avatar.thumb_url as avatar_thumb_url from users left join files as cover on cover.id = users.cover_id left join files as avatar on avatar.id = users.avatar_id  where users.id = ? ", id, function (err, res) {
            return err ? reject(err) : resolve(res[0]);
        }
        );
    });
};

User.getUserInWeekOfYear = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select count(u.id) as total, WEEK(u.created_at) as week
        from users as u
        where u.created_at>='${mindate}'
        group by WEEK(u.created_at)
        order by WEEK(u.created_at) asc`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};

User.getUserInDayOfMonth = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select count(u.id) as total, DAY(u.created_at) as day
        from users as u
        where u.created_at>='${mindate}'
        group by DAY(u.created_at)
        order by DAY(u.created_at) asc`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};

User.getUserInMonthsOfYear = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select count(u.id) as total, MONTH(u.created_at) as month
        from users as u
        where u.created_at>='${mindate}'
        group by MONTH(u.created_at)
        order by MONTH(u.created_at) asc`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};
User.findByEmail = function findByEmail(email) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from users where email = ? ", email, function (err, res) {
            return err ? resolve(null) : resolve(res.length > 0 ? res[0] : null);
        });
    });
};
module.exports = User;