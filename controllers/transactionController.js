'use strict';
var slug = require('slug')

var Transaction = require('../models/transaction');

exports.list_all_transaction = async function (req, res) {
    var transactions = await Transaction.getAllTransaction(req.query);
    res.send({ message: "Success", data: transactions })

};


exports.get_transaction_by_id = async function (req, res) {
    const { params } = req
    var transaction = await Transaction.getTransactionById(params.transactionId)
    res.send({ message: "Success", data: transaction })
};