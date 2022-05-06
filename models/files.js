'user strict';
var sql = require('../config/db.js');
//type
const IMAGE = 0;
const AUDIO = 1;
const VIDEO = 2;
const GIF = 3;
const DOCUMENT = 4;
const PDF = 5;

//Category object constructor
var File = function (file) {
    this.original_url = file.original_url;
    this.thumb_url = file.thumb_url;
    this.type = file.type
};

File.IMAGE = IMAGE;
File.AUDIO = AUDIO;
File.VIDEO = VIDEO;
File.GIF = GIF;
File.DOCUMENT = DOCUMENT;
File.PDF = PDF;

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