'user strict';
var sql = require('../config/db.js');
var slug = require('slug')
const SELL = 1
const ASSET = 0
//Item object constructor
var Item = function (item) {
    this.name = item.name;
    this.slug = slug(item.name);
    this.image_url = item.image_url;
    this.number_favorites = item.number_favorites;
    this.owner = item.owner;
    this.price = item.price;
    this.symbol = item.symbol;
    this.created = item.created;
    this.collection_id = item.collection_id;
    this.block_id = item.block_id;
    this.sell = item.sell;
    this.category_id = item.category_id
    this.created_at = new Date()
};
Item.createItem = function createItem(item, result) {
    sql.query("INSERT INTO items set ?", item, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Item.getItemById = function createUser(itemId, user_id, result) {
    sql.query("Select *, (select favorites.id from favorites where favorites.user_id = ? AND favorites.item_id = ? ) as is_favorite from items where id = ? ", [user_id, itemId, itemId], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log("error: ", res);
            result(null, res[0]);

        }
    });
};
Item.getAllItem = function getAllItem(params, result) {
    const { key, min_price, max_price, collection_id, category_id } = params
    var str = ""
    if (key) {
        str += ` AND name LIKE '%${key}%'`
    }
    if (min_price) {
        str += ` AND price >= ${min_price}`
    }
    if (max_price) {
        str += ` AND price <= ${max_price}`
    }
    if (collection_id) {
        str += ` AND collection_id = ${collection_id}`
    }
    if (category_id) {
        str += ` AND category_id = ${category_id}`
    }

    sql.query(`Select * from items WHERE sell = ${SELL} ${str}`, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Item.updateById = function (id, item, result) {
    sql.query("UPDATE items SET name = ? WHERE id = ?", [item.name, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Item.remove = function (id, result) {
    sql.query("DELETE FROM items WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {

            result(null, res);
        }
    });
};
Item.getFavoriteItem = function getFavoriteItem(user_id, result) {
    sql.query(`SELECT DISTINCT *
    FROM items
    LEFT JOIN favorites
    ON items.id = favorites.item_id
    WHERE favorites.user_id = ? AND items.sell = ?`, [user_id, SELL], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });

};
module.exports = Item;