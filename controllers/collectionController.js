'use strict';
var slug = require('slug')

var Collection = require('../models/collection');
var Item = require('../models/item');

exports.list_all_collection = function (req, res) {
    const { key } = req.query
    var newKey = key ? key : ""
    Collection.getAllCollection(newKey, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_collection = async function (req, res) {
    const { user_id, body } = req
    const { name, logo_url, banner_url, description, category_id } = body
    var new_collection = {
        name,
        logo_url,
        banner_url,
        description,
        category_id,
        slug: slug(name),
        owner: user_id,
        created: user_id,
    }
    Collection.createCollection(new_collection, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success" })
    });
};


exports.read_a_collection = function (req, res) {
    Collection.getCollectionById(req.params.collectionId, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};


exports.update_a_collection = async function (req, res) {
    const { user_id, body, params } = req
    var collection = await Collection.getCollectionById(params.collectionId)
    if (user_id != collection.created) {
        res.status(400)
            .send({ message: "Permission denied" });
        return;
    }
    Collection.updateById(params.collectionId, body, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json(task);
    });
};


exports.delete_a_collection = function (req, res) {
    Collection.remove(req.params.taskId, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json({ message: 'Collection successfully deleted' });
    });
};

exports.rankings = function (req, res) {
    Collection.updateInTime(req.query, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};