'user strict';
var sql = require('../config/db.js');
var slug = require('slug')

//item sell
const SELL = 1
const ASSET = 0
//item filter
const CREATED_SORT = 1
const PRICE_INCREASE_SORT = 2
const PRICE_REDUCED_SORT = 3
const FAVORITE_SORT = 4
const OLDEST_SORT = 5
// const SOLD_SORT = 6

//Item object constructor
var Item = function (item) {
    this.name = item.name;
    this.slug = slug(item.name);
    this.image_id = item.image_id;
    this.number_favorites = item.number_favorites;
    this.owner = item.owner;
    this.price = item.price;
    this.symbol = item.symbol;
    this.created = item.created;
    this.collection_id = item.collection_id;
    this.block_id = item.block_id;
    this.sell = SELL;
    this.category_id = item.category_id
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
Item.getItemById = function getItemById(itemId) {
    return new Promise((resolve, reject) => {
        sql.query(`Select items.*, image.original_url as image_url, image.thumb_url as image_thumb_url
        from items 
        left join files as image
        on image.id = items.image_id
        where items.id = ${itemId}`,
            function (err, res) {
                console.log(err)
                return err ? resolve(null) : resolve(res[0]);
            });
    });
};


Item.getDetailItem = function getDetailItem(itemId, user_id) {
    return new Promise((resolve, reject) => {
        sql.query(`Select items.*, image.original_url as image_url, image.thumb_url as image_thumb_url, users.username as user_name, users.id as user_id, collections.name as collection_name, image_collection.thumb_url as collection_logo, collections.description as collection_description,
         (select favorites.id from favorites where favorites.user_id = ${user_id} AND favorites.item_id = ${itemId} ) as is_favorite 
        from items 
        left join collections
        on items.collection_id = collections.id
        left join users
        on users.public_address = items.created
        left join files as image
        on image.id = items.image_id
        left join files as image_collection
        on image_collection.id = collections.logo_id
        where items.id = ${itemId} LIMIT 1`,
            function (err, res) {
                console.log(err)
                return err ? resolve(null) : resolve(res[0]);
            });
    });
};
Item.getAllItem = function getAllItem(params, result) {
    const { key, min_price, max_price, collection_id, category_id, sort } = params
    var str = ""
    if (key) {
        str += ` AND items.name LIKE '%${key}%'`
    }
    if (min_price) {
        str += ` AND items.price >= ${min_price}`
    }
    if (max_price) {
        str += ` AND items.price <= ${max_price}`
    }
    if (collection_id) {
        str += ` AND items.collection_id = ${collection_id}`
    }
    if (category_id) {
        str += ` AND items.category_id = ${category_id}`
    }

    var orderBy = ""
    if (sort == CREATED_SORT) {
        orderBy = "ORDER BY items.created_at asc"
    } else if (sort == PRICE_INCREASE_SORT) {
        orderBy = "ORDER BY items.price asc"
    } else if (sort == PRICE_REDUCED_SORT) {
        orderBy = "ORDER BY items.price desc"
    } else if (sort == OLDEST_SORT) {
        orderBy = "ORDER BY items.created_at desc"
    } else if (sort == FAVORITE_SORT) {
        orderBy = "ORDER BY items.number_favorites desc"
    }

    sql.query(`Select items.*, collections.name as collection_name, image.original_url as image_url, image.thumb_url as image_thumb_url
    from items 
    LEFT JOIN collections
    ON items.collection_id = collections.id
    LEFT JOIN files as image
    ON image.id = items.image_id
    WHERE items.sell = ${SELL} ${str} 
    ${orderBy}`, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Item.buyItemById = function (id, public_address, result) {
    sql.query(`UPDATE items SET owner = ?, sell = ${ASSET} WHERE id = ?`, [public_address, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Item.resellItemById = function (id, result) {
    sql.query(`UPDATE items SET sell = ${SELL} WHERE id = ?`, [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
Item.updateFavoriteById = function (id, number_favorites) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE items SET number_favorites = ? WHERE id = ?", [number_favorites, id], function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
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
    sql.query(`SELECT DISTINCT items.*, image.original_url as image_url, image.thumb_url as image_thumb_url
    FROM items
    LEFT JOIN favorites
    ON items.id = favorites.item_id
    LEFT JOIN files as image
    ON image.id = items.image_id
    WHERE favorites.user_id = ${user_id} AND items.sell = ${SELL}`, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });

};
Item.createdItems = function (public_address) {
    return new Promise((resolve, reject) => {
        sql.query(`Select items.*, image.original_url as image_url, image.thumb_url as image_thumb_url 
        from items 
        left join files as image
        on image.id = items.image_id
        where items.created = ? `, [public_address], function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
Item.assetItems = function (public_address) {
    return new Promise((resolve, reject) => {
        sql.query(`Select items.*, image.original_url as image_url, image.thumb_url as image_thumb_url 
        from items 
        left join files as image
        on image.id = items.image_id
        where items.created != ${public_address} and items.owner = ${public_address}`, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
Item.getMostFavoriteItem = function () {
    return new Promise((resolve, reject) => {
        sql.query(`Select items.*, image.original_url as image_url, image.thumb_url as image_thumb_url 
        from items 
        left join files as image
        on image.id = items.image_id
        where items.sell = ${SELL}
        ORDER BY items.number_favorites desc LIMIT 1 `, function (err, res) {
            return err ? resolve(null) : resolve(res[0]);
        });
    });
};
module.exports = Item;