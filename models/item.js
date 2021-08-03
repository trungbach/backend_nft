'user strict';
var sql = require('../config/db.js');
var slug = require('slug')
const SELL = 1
const ASSET = 0
//Item object constructor
var Item = function(item){
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
    this.created_at = new Date()
};
Item.createItem = function createItem(item, result) {
    sql.query("INSERT INTO items set ?", item, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};
Item.getItemById = function createUser(itemId, result) {
    sql.query("Select * from items where id = ? ", itemId, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res[0]);

        }
    });
};
Item.getAllItem = function getAllItem(result) {
    sql.query(`Select * from items WHERE sell = ${SELL}`, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};
Item.updateById = function(id, item, result){
    sql.query("UPDATE items SET name = ? WHERE id = ?", [item.name, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};
Item.remove = function(id, result){
    sql.query("DELETE FROM items WHERE id = ?", [id], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{

            result(null, res);
        }
    });
};

module.exports= Item;