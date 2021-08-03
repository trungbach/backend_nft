'user strict';
var sql = require('../config/db.js');
var slug = require('slug')
//Category object constructor
var Category = function(category){
    console.log(category);
    this.name = category.name;
    this.slug = slug(category.name);
    this.logo_url = category.logo_url;
    this.image_url = category.image_url;
};
Category.createCategory = function createUser(newCategory, result) {
    sql.query("INSERT INTO categories set ?", newCategory, function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};
Category.getCategoryById = function createUser(categoryId, result) {
    sql.query("Select * from categories where id = ? ", categoryId, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res[0]);

        }
    });
};
Category.getAllCategory = function getAllCategory(result) {
    sql.query("Select * from categories", function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};
Category.updateById = function(id, category, result){
    sql.query("UPDATE categories SET name = ? WHERE id = ?", [category.name, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};
Category.remove = function(id, result){
    sql.query("DELETE FROM categories WHERE id = ?", [id], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{

            result(null, res);
        }
    });
};

module.exports= Category;