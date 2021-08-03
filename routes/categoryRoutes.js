'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/categoryController');

    // todoList Routes
    app.route('/categories')
        .get(todoList.list_all_category)
        .post(auth, todoList.create_a_category);

    // app.get("/welcome", auth, todoList.list_all_category);

    app.route('/categories/:categoryId')
        .get(todoList.read_a_category)
        .put(auth, todoList.update_a_category)
        .delete(auth, todoList.delete_a_category);
};