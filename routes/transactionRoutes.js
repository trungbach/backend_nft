'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/transactionController');

    app.route('/transactions')
        .get(todoList.list_all_transaction);

    app.route('/transactions/:transactionId')
        .get(todoList.get_transaction_by_id);
};