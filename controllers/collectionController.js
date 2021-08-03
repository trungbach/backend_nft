'use strict';
var slug = require('slug')

var Collection = require('../models/collection');
var User = require('../models/user');

exports.list_all_collection = function (req, res) {
    Collection.getAllCollection(function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_collection = async function (req, res) {
    const { user_id, body } = req
    const { name, logo_url, banner_url, description, category_id } = body
    var user = await User.findById(user_id);
    var new_collection = {
        name,
        logo_url,
        banner_url,
        description,
        category_id,
        slug: slug(name),
        owner: user.public_address,
        created: user.public_address,
        created_at: new Date()
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


exports.update_a_collection = function (req, res) {
    Collection.updateById(req.params.collectionId, req.body, function (err, task) {
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