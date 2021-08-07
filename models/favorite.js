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
Favorite.createFavorite = function createFavorite(favorite) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO favorites set ?", favorite, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
Favorite.remove = function (user_id, item_id) {
    return new Promise((resolve, reject) => {
    sql.query("DELETE FROM favorites WHERE user_id = ? AND item_id = ?", [user_id, item_id], function (err, res) {
        return err ? resolve(null) : resolve(res);
    });
});
};
module.exports = Favorite;