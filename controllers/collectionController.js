'use strict';
var slug = require('slug')

var Collection = require('../models/collection');

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
    const { name, description, category_id, logo_id, cover_id } = body
    var new_collection = {
        name,
        description,
        category_id,
        slug: slug(name),
        owner: user_id,
        created: user_id,
        logo_id: logo_id,
        cover_id: cover_id,
    }
    Collection.createCollection(new_collection, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success" })
    });
};


exports.get_collection_by_id = async function (req, res) {
    const { params } = req
    var collection = await Collection.getCollectionById(params.collectionId)
    res.send({ message: "Success", data: collection })
};

exports.my_collections = async function (req, res) {
    const { user_id } = req
    var collection = await Collection.getMyCollections(user_id)
    res.send({ message: "Success", data: collection })
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