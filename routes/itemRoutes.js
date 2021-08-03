'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/itemController');

    // todoList Routes
    app.route('/items')
        .get(todoList.list_all_item)
        .post(auth, todoList.create_a_item);

    app.route('/items/:itemId')
        .get(todoList.read_a_item);
        // .put(auth, todoList.update_a_item)
        // .delete(auth, todoList.delete_a_item);
};