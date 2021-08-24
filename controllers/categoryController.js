'use strict';

var Category = require('../models/category');
var User = require('../models/user');

exports.list_all_category = function (req, res) {
    Category.getAllCategory(function (err, task) {

        console.log('controller')
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });

        res.send({ message: "Success", data: task })
    });
};

exports.create_a_category = async function (req, res) {
    const { user_id, body } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        var new_category = new Category(body);
        Category.createCategory(new_category, function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.send({ message: "Success", data: task })
        });
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};


exports.read_a_category = function (req, res) {
    Category.getCategoryById(req.params.categoryId, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json(task);
    });
};


exports.update_a_category = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        Category.updateById(req.params.categoryId, new Category(req.body), function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.json(task);
        });
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};


exports.delete_a_category = async function (req, res) {
    const { user_id, params } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        Category.remove(params.categoryId, function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.json({ message: 'Category successfully deleted' });
        });
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};