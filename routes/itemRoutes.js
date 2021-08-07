'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/itemController');

    // todoList Routes
    app.route('/items')
        .get(todoList.list_all_item)
        .post(auth, todoList.create_a_item);

    app.route('/items/:itemId')
        .get(auth, todoList.read_a_item);

    app.route('/favorite-items')
        .get(auth, todoList.list_favorite_item);

};