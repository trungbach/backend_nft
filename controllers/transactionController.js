'use strict';

var Transaction = require('../models/transaction');
var User = require('../models/user');

exports.list_all_transaction = async function (req, res) {
    const { user_id, query } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        var transactions = await Transaction.getAllTransaction(req.query);
        res.send({ message: "Success", data: transactions })
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