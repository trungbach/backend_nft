'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/favoriteController');

    app.route('/create-favorites')
        .post(auth, todoList.create_a_favorite);

    app.route('/delete-favorites')
        .post(auth, todoList.delete_a_favorite);
};