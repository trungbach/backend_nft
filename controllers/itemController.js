'use strict';
var slug = require('slug')
var Item = require('../models/item');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var File = require('../models/files');

exports.list_all_item = async function (req, res) {
    var total_items = await Item.countAllItem(req.query)
    Item.getAllItem(req.query, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task, total_items })
    });
};

exports.list_favorite_item = function (req, res) {
    const { user_id, page } = req.query
    Item.getFavoriteItem(user_id, page, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_item = async function (req, res) {
    const { user_id, body } = req
    const { name, image_id, price, symbol, collection_id, block_id, category_id, type } = body
    var user = await User.findById(user_id);
    var new_item = {
        name,
        image_id,
        price,
        symbol: symbol ? symbol : Item.ETH,
        slug: slug(name),
        owner: user.public_address,
        created: user.public_address,
        collection_id,
        category_id,
        block_id,
        sell: Item.SELL,
        type: type ? type : File.IMAGE
    }
    let item = await Item.createItem(new_item);
    if(item == null){
        res.status(400)
                .send({ message: "Error" });
    }else{
        let transaction = {
            user_id,
            item_id: item.insertId, 
            type: Transaction.CREATE,
            price,
            symbol,
            benefit: (price * 0.01),
        }
        await Transaction.createTransaction(transaction)
        res.send({ message: "Success", data: item })
    }
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
        let task = await Item.buyItemById(params.itemId, user.public_address);
        if(task == null){
            res.status(400)
                    .send({ message: "Error" });
        }else{
            let transaction = {
                user_id,
                item_id: params.itemId, 
                type: Transaction.BUY,
                price: item.price,
                symbol: item.symbol,
                benefit: 0,
            }
            await Transaction.createTransaction(transaction)
            res.json(task);
        }
    }else{
        res.status(400).send({ message: "Error", data: err });
    }
};

exports.resell_item = async function (req, res) {
    const { user_id, params, body } = req
    var user = await User.findById(user_id);
    var item = await Item.getItemById(params.itemId);
    if(item.sell == Item.ASSET && item.owner == user.public_address){
        let task = await Item.resellItemById(params.itemId,body.price);
        if(task == null){
            res.status(400)
                    .send({ message: "Error" });
        }else{
            let transaction = {
                user_id,
                item_id: params.itemId, 
                type: Transaction.RESELL,
                price: body.price,
                symbol: item.symbol,
                benefit: (body.price * 0.01),
            }
            await Transaction.createTransaction(transaction)
            res.json(task);
        }
    }else{
        res.status(400).send({ message: "Error", data: err });
    }
};


exports.my_items = async function (req, res) {
    const { user_id, page } = req.query
    var user = await User.findById(user_id);
    var task = await Item.createdItems(user.public_address, page);
    res.send({ message: "Success", data: task })
};

exports.my_assets = async function (req, res) {
    const { user_id, page } = req.query
    var user = await User.findById(user_id);
    var task = await Item.assetItems(user.public_address, page);
    res.send({ message: "Success", data: task })
};

exports.resell = async function (req, res) {
    const { user_id, page } = req.query
    var user = await User.findById(user_id);
    var task = await Item.resell(user.public_address, page);
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