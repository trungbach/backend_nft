'user strict';
var sql = require('../config/db.js');
var slug = require('slug')
//Favorite object constructor
var Favorite = function (favorite) {
    this.user_id = favorite.user_id;
    this.item_id = favorite.item_id;
};

Favorite.findFavorite = function findFavorite(favorite) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from favorites WHERE user_id = ? AND item_id = ?", [favorite.user_id, favorite.item_id], function (err, res) {
            return err ? resolve(null) : resolve(res.length > 0 ? res[0] : null);
        });
    });
};
Favorite.createFavorite = function createFavorite(favorite, result) {
    sql.query("INSERT INTO favorites set ?", favorite, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Favorite.remove = function (favorite, result) {
    sql.query("DELETE FROM favorites WHERE user_id = ? AND item_id = ?", [favorite.user_id, favorite.item_id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {

            result(null, res);
        }
    });
};
module.exports = Favorite;