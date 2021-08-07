'use strict';
var slug = require('slug')
var Item = require('../models/item');
var User = require('../models/user');

exports.list_all_item = function (req, res) {
    Item.getAllItem(req.query, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.list_favorite_item = function (req, res) {
    Item.getFavoriteItem(req.user_id, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_item = async function (req, res) {
    const { user_id, body } = req
    const { name, image_url, price, symbol, collection_id, block_id, category_id } = body
    var user = await User.findById(user_id);
    var new_item = {
        name,
        image_url,
        price,
        symbol,
        slug: slug(name),
        owner: user.public_address,
        created: user.public_address,
        collection_id,
        category_id,
        block_id,
        sell: 1,
        created_at: new Date()
    }
    Item.createItem(new_item, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};


exports.read_a_item = async function (req, res) {
    const { user_id, params } = req
    var task = await Item.getItemById(params.itemId, user_id);
    if (task == null)
        res.status(400)
            .send({ message: "Error" });
    res.json(task);
};


exports.update_a_item = function (req, res) {
    Item.updateById(req.params.itemId, new Item(req.body), function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json(task);
    });
};


exports.delete_a_item = function (req, res) {
    Item.remove(req.params.taskId, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json({ message: 'Item successfully deleted' });
    });
};