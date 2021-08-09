'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/nftController');

    app.route('/all-items')
        .get(todoList.list_all_items);

    app.route('/my-items')
        .get(todoList.list_item_created);

    app.route('/my-assets')
        .get(todoList.list_item_bought);

    app.route('/create_item')
        .post(todoList.create_item);

    app.route('/item-by-id/:id')
        .get(todoList.detail_item);
};