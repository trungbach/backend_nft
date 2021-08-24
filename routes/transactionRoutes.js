'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/transactionController');

    app.route('/transactions')
        .get(auth,todoList.list_all_transaction);

    app.route('/transactions/:transactionId')
        .get(auth,todoList.get_transaction_by_id);
};