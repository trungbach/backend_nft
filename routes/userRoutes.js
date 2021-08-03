'use strict';
module.exports = function (app) {
    var todoList = require('../controllers/userController');

    // todoList Routes
    app.route('/users')
        .get(todoList.list_all_user)
        .post(todoList.create_a_user);

    app.route('/token_by_address').post(todoList.token_by_address)
        
    app.route('/check_public_address').post(todoList.check_public_address);
    app.route('/signature_verification_address').post(todoList.signature_verification);
};