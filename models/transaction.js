'user strict';
var sql = require('../config/db.js');
//type
CREATE = 0,
BUY = 1,
RESELL = 2
//Transaction object constructor
var Transaction = function (transaction) {
    this.user_id = transaction.user_id;
    this.item_id = transaction.item_id;
    this.type = transaction.type;
    this.price = transaction.price;
    this.symbol = transaction.symbol;
    this.benefit = transaction.benefit;
};
Transaction.CREATE = CREATE
Transaction.BUY = BUY
Transaction.RESELL = RESELL

Transaction.createTransaction = function createTransaction(newTransaction, result) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO transactions set ?", newTransaction, function (err, res) {
            return err ? resolve(null) : resolve(res.insertId);
        });
    });
};
Transaction.getTransactionById = function getTransactionById(transactionId, result) {
    return new Promise((resolve, reject) => {
        sql.query(`Select transactions.* , user.username as user_name, item.name as item_name
        from transactions 
        LEFT JOIN users as user
        ON user.id = transactions.user_id
        LEFT JOIN items as item
        ON item.id = transactions.item_id
        where transactions.id = ?`, transactionId, function (err, res) {
            return err ? resolve(null) : resolve(res[0]);
        });
    });
}
Transaction.getAllTransaction = function getAllTransaction(params) {
    const { start_time, end_time, user_id, item_id, symbol } = params
    var str = ""
    if (user_id) {
        str += ` AND transactions.user_id = ${user_id}`
    }
    if (item_id) {
        str += ` AND transactions.item_id = ${item_id}`
    }
    if (symbol) {
        str += ` AND transactions.symbol = '${symbol}'`
    }

    return new Promise((resolve, reject) => {
    sql.query(`SELECT transactions.*, user.username as user_name, item.name as item_name
        FROM transactions
        LEFT JOIN users as user
        ON user.id = transactions.user_id
        LEFT JOIN items as item
        ON item.id = transactions.item_id
        WHERE transactions.created_at >= '${start_time}' AND transactions.created_at <= '${end_time}' ${str}
        ORDER BY transactions.created_at desc`, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};

module.exports = Transaction;