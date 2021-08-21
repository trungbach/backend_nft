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
    const { user_id } = req.query
    Item.getFavoriteItem(user_id, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_item = async function (req, res) {
    const { user_id, body } = req
    const { name, image_id, price, symbol, collection_id, block_id, category_id } = body
    var user = await User.findById(user_id);
    var new_item = {
        name,
        image_id,
        price,
        symbol,
        slug: slug(name),
        owner: user.public_address,
        created: user.public_address,
        collection_id,
        category_id,
        block_id,
        sell: Item.SELL,
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
    var task = await Item.getDetailItem(params.itemId, user_id);
    if (task == null)
        res.status(400)
            .send({ message: "Error" });
    res.json(task);
};


exports.buy_item = async function (req, res) {
    const { user_id, params } = req
    var user = await User.findById(user_id);
    var item = await Item.getItemById(params.itemId);
    if(item.sell == Item.SELL){
        Item.buyItemById(params.itemId, user.public_address, function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.json(task);
        });
    }else{
        res.status(400).send({ message: "Error", data: err });
    }
};

exports.resell_item = async function (req, res) {
    const { user_id, params, body } = req
    var user = await User.findById(user_id);
    var item = await Item.getItemById(params.itemId);
    if(item.sell == Item.ASSET && item.owner == user.public_address){
        Item.resellItemById(params.itemId,body.price, function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.json(task);
        });
    }else{
        res.status(400).send({ message: "Error", data: err });
    }
};


exports.my_items = async function (req, res) {
    const { user_id } = req.query
    var user = await User.findById(user_id);
    var task = await Item.createdItems(user.public_address);
    res.send({ message: "Success", data: task })
};

exports.my_assets = async function (req, res) {
    const { user_id } = req.query
    var user = await User.findById(user_id);
    console.log(user.public_address)
    var task = await Item.assetItems(user.public_address);
    res.send({ message: "Success", data: task })
};

exports.resell = async function (req, res) {
    const { user_id } = req.query
    var user = await User.findById(user_id);
    console.log(user.public_address)
    var task = await Item.resell(user.public_address);
    res.send({ message: "Success", data: task })
};


exports.delete_a_item = function (req, res) {
    Item.remove(req.params.taskId, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json({ message: 'Item successfully deleted' });
    });
};

exports.most_favorite_item = async function (req, res) {
    var item = await Item.getMostFavoriteItem()
    res.send({ message: "Success", data: item });
};