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
    this.logo_id = collection.logo_id;
    this.cover_id = collection.cover_id;
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
Collection.getCollectionById = function getCollectionById(id) {
    return new Promise((resolve, reject) => {
        sql.query(`Select collections.*, cover.original_url as cover_url, logo.original_url as logo_url, cover.thumb_url as cover_thumb_url, logo.thumb_url as logo_thumb_url,
        (Select count(items.id) from items where items.created != items.owner and items.collection_id = ${id}) as total_bought_item,
        (Select count(items.id) from items where items.collection_id = ${id}) as total_item,
        (Select items.price from items where items.collection_id = ${id} ORDER BY items.price asc LIMIT 1) as min_price,
        (Select items.price from items where items.collection_id = ${id} ORDER BY items.price desc LIMIT 1) as max_price 
        from collections 
        left join files as cover 
        on cover.id = collections.cover_id 
        left join files as logo 
        on logo.id = collections.logo_id  
        where collections.id = ?`, id, function (err, res) {
            return err ? resolve(null) : resolve(res.length > 0 ? res[0] : null);
        });
    });
};
Collection.getAllCollection = function getAllCollection(name, result) {
    sql.query(`Select collections.*, cover.original_url as cover_url, logo.original_url as logo_url, cover.thumb_url as cover_thumb_url, logo.thumb_url as logo_thumb_url from collections left join files as cover on cover.id = collections.cover_id left join files as logo on logo.id = collections.logo_id  where collections.name LIKE '%${name}%'`, function (err, res) {
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
    sql.query("UPDATE collections SET name = ?, logo_id= ?, cover_id= ?, description = ?, slug = ?  WHERE id = ?",
        [collection.name, collection.logo_id, collection.cover_id, collection.description, slug(collection.name), id],
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
    sql.query(`SELECT DISTINCT collections.*, cover.original_url as cover_url, logo.original_url as logo_url, cover.thumb_url as cover_thumb_url, logo.thumb_url as logo_thumb_url
    FROM collections
    LEFT JOIN items
    ON collections.id = items.collection_id
    LEFT JOIN files as cover 
    ON cover.id = collections.cover_id 
    LEFT JOIN files as logo 
    ON logo.id = collections.logo_id
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
        sql.query("Select collections.*, cover.original_url as cover_url, logo.original_url as logo_url, cover.thumb_url as cover_thumb_url, logo.thumb_url as logo_thumb_url from collections left join files as cover on cover.id = collections.cover_id left join files as logo on logo.id = collections.logo_id where collections.owner = ? ", user_id, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
module.exports = Collection;