'use strict';
const auth = require("../middleware/auth");
module.exports = function (app) {
    var todoList = require('../controllers/transactionController');

    app.route('/transactions')
        .get(auth,todoList.list_all_transaction);

    app.route('/transactions/:transactionId')
        .get(auth,todoList.get_transaction_by_id);

    app.route('/admin/transactions-weeks-of-year').get(auth,todoList.summary_weeks_of_year);
    app.route('/admin/transactions-days-of-month').get(auth,todoList.summary_days_of_month);
    app.route('/admin/transactions-months-of-year').get(auth,todoList.summary_months_of_year);
};