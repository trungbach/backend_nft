'user strict';
var sql = require('../config/db.js');
var slug = require('slug')
//Collection object constructor
var Collection = function (collection) {
    this.name = collection.name;
    this.logo_url = collection.logo_url;
    this.banner_url = collection.banner_url;
    this.slug = collection.slug;
    this.owner = collection.owner;
    this.description = collection.description;
    this.created = collection.created;
    this.category_id = collection.category_id;
    this.created_at = new Date()
};

Collection.createCollection = function createCollection(collection, result) {
    sql.query("INSERT INTO collections set ?", collection, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
Collection.getCollectionById = function createUser(itemId, result) {
    sql.query("Select * from collections where id = ? ", itemId, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res[0]);

        }
    });
};
Collection.getAllCollection = function getAllCollection(result) {
    sql.query("Select * from collections", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Collection.updateById = function (id, collection, result) {
    sql.query("UPDATE collections SET name = ?, logo_url= ?, banner_url= ?, description = ?, slug = ?  WHERE id = ?",
        [collection.name, collection.logo_url, collection.banner_url, collection.description, slug(collection.name), id],
        function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            }
            else {
                result(null, res);
            }
        });
};
Collection.remove = function (id, result) {
    sql.query("DELETE FROM collections WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {

            result(null, res);
        }
    });
};

module.exports = Collection;