'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/userController');

    // todoList Routes
    app.route('/users')
        .get(auth,todoList.list_all_user)
        .post(todoList.create_a_user);

    app.route('/update-profile').post(auth, todoList.update_profile);
    app.route('/get-profile-buy-id/:userId').get(todoList.get_profile);
    app.route('/token_by_address').post(todoList.token_by_address)
    app.route('/check_public_address').post(todoList.check_public_address);
    app.route('/signature_verification_address').post(todoList.signature_verification);

    app.route('/admin/login').post(todoList.admin_login);
};