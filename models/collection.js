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
Collection.getCollectionById = function createUser(itemId) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from collections where id = ? LIMIT 1", itemId, function (err, res) {
            return err ? resolve(null) : resolve(res.length > 0 ? res[0] : null);
        });
    });
};
Collection.getAllCollection = function getAllCollection(name, result) {
    sql.query(`Select * from collections where name LIKE '%${name}%'`, function (err, res) {
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
Collection.updateInTime = function updateInTime(params, result) {
    const { start_time, end_time, category_id } = params
    sql.query(`SELECT DISTINCT collections.*
    FROM collections
    LEFT JOIN items
    ON collections.id = items.collection_id
    ${category_id ? `WHERE collections.category_id = ${category_id}` : ''}
    ORDER BY (select count(items.id) from items WHERE items.updated_at >= '${start_time}' AND items.updated_at <= '${end_time}')`, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Collection.getMyCollections = function getMyCollections(user_id) {
    return new Promise((resolve, reject) => {
        sql.query("Select * from collections where owner = ? ", user_id, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
module.exports = Collection;