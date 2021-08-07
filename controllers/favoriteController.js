'use strict';
var slug = require('slug')

var Favorite = require('../models/favorite');

exports.create_a_favorite = async function (req, res) {
    const { user_id, body } = req
    const { item_id } = body
    var new_favorite = {
        user_id,
        item_id,
    }
    var favorite = await Favorite.findFavorite(new_favorite);
    if (favorite != null) {
        res.send({ message: "Success", data: favorite })
        return
    }
    Favorite.createFavorite(new_favorite, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success" })
    });
};


function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    console.log(obj)
    return JSON.stringify(obj) === JSON.stringify({});
}



exports.delete_a_favorite = function (req, res) {
    Favorite.remove(req.body, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.json({ message: 'Favorite successfully deleted' });
    });
};