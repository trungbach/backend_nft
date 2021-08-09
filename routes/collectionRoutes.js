'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/collectionController');

    app.route('/collections')
        .get(todoList.list_all_collection)
        .post(auth, todoList.create_a_collection);

    app.route('/collections/:collectionId')
        .get(todoList.read_a_collection)
        .put(auth, todoList.update_a_collection)
        .delete(auth, todoList.delete_a_collection);

    app.route('/collections-rankings')
        .get(todoList.rankings)

    app.route('/my-collections')
        .get(auth, todoList.my_collections)
};