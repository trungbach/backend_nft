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

    app.route('/buy-item/:itemId')
        .put(auth, todoList.buy_item);

    app.route('/favorite-items')
        .get(todoList.list_favorite_item);

    app.route('/my-created-items')
        .get(todoList.my_items);

    app.route('/my-assets-items')
        .get(todoList.my_assets);

    app.route('/most-favorite-item')
        .get(todoList.most_favorite_item);

    app.route('/resell-item/:itemId')
        .put(auth, todoList.resell_item);
};