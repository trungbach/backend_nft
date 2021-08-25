'use strict';

var Transaction = require('../models/transaction');
var User = require('../models/user');

exports.list_all_transaction = async function (req, res) {
    const { user_id, query } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        var total_items = await Transaction.countAllTransaction(query);
        var transactions = await Transaction.getAllTransaction(query);
        res.send({ message: "Success", data: transactions, total_items })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }

};


exports.get_transaction_by_id = async function (req, res) {
    const { user_id, params } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        var transaction = await Transaction.getTransactionById(params.transactionId)
        res.send({ message: "Success", data: transaction })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.summary_weeks_of_year = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await Transaction.getAmountInWeekOfYear(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.summary_days_of_month = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await Transaction.getAmountInDayOfMonth(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.summary_months_of_year = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await Transaction.getAmountInMonthsOfYear(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};