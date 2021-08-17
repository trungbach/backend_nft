'user strict';
var sql = require('../config/db.js');

//Category object constructor
var File = function (file) {
    this.original_url = file.original_url;
    this.thumb_url = file.thumb_url;
};
File.createFile = function createFile(newFile) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO files set ?", newFile, function (err, res) {
            return err ? reject(err) : resolve(res.insertId);
        });
    });
};

File.getItemById = function getItemById(id) {
    return new Promise((resolve, reject) => {
        sql.query(`Select *
        from files 
        where files.id = ${id}`,
            function (err, res) {
                console.log(err)
                return err ? resolve(null) : resolve(res[0]);
            });
    });
};

module.exports = File;