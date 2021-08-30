'user strict';
var sql = require('../config/db.js');
var config = require('../public/config.json');
const limit = config.limit
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
Transaction.countAllTransaction = function countAllTransaction(params) {
    const { start_time, end_time, user_id, item_id, symbol, type } = params
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
    if (type) {
        str += ` AND transactions.type = '${type}'`
    }

    return new Promise((resolve, reject) => {
    sql.query(`SELECT count(transactions.id) as total 
        FROM transactions
        WHERE transactions.created_at >= '${start_time}' AND transactions.created_at <= '${end_time}' ${str}`, function (err, res) {
            if (err) {
                console.log("error: ", err);
            }
            return err ? resolve(null) : resolve(res[0].total);
        });
    });
};
Transaction.getAllTransaction = function getAllTransaction(params) {
    const { start_time, end_time, user_id, item_id, symbol, page } = params
    
    let defaultPage = 0
    if (page) {
        defaultPage = page
    }
    const offset = defaultPage * limit

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
    if (type) {
        str += ` AND transactions.type = '${type}'`
    }

    return new Promise((resolve, reject) => {
    sql.query(`SELECT transactions.*, user.username as user_name, item.name as item_name
        FROM transactions
        LEFT JOIN users as user
        ON user.id = transactions.user_id
        LEFT JOIN items as item
        ON item.id = transactions.item_id
        WHERE transactions.created_at >= '${start_time}' AND transactions.created_at <= '${end_time}' ${str}
        ORDER BY transactions.created_at desc
        limit ${limit} OFFSET ${offset}`, function (err, res) {
            return err ? resolve(null) : resolve(res);
        });
    });
};
Transaction.getAmountInWeekOfYear = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select sum(t.benefit) as total_eth, t.symbol, 
        WEEK(t.created_at) as week
        from transactions as t 
        where t.created_at>='${mindate}'
        group by WEEK(t.created_at), t.symbol`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};

Transaction.getAmountInDayOfMonth = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select sum(t.benefit) as total_eth, t.symbol, 
                DAY(t.created_at) as day
                from transactions as t 
                where t.created_at>='${mindate}'
                group by DAY(t.created_at), t.symbol`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};

Transaction.getAmountInMonthsOfYear = function (mindate) {
    return new Promise((resolve, reject) => {
        sql.query(`select sum(t.benefit) as total_eth, t.symbol, 
        MONTH(t.created_at) as month
        from transactions as t 
        where t.created_at>='${mindate}'
        group by MONTH(t.created_at), t.symbol`, function (err, res) {
            return err ? reject(err) : resolve(res);
        }
        );
    });
};

module.exports = Transaction;