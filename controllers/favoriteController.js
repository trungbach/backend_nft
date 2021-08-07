'use strict';
var slug = require('slug')

var Favorite = require('../models/favorite');
var Item = require('../models/item');

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
    var new_favorite = await Favorite.createFavorite(new_favorite);
    if (new_favorite != null) {
        var item = await Item.getItemById(item_id);
        await Item.updateFavoriteById(item_id, Number(item.number_favorites) + 1);
        res.send({ message: "Success", data: new_favorite })
    }
};

exports.delete_a_favorite = async function (req, res) {
    const { user_id, body } = req
    const { item_id } = body
    var favorite = await Favorite.remove(user_id, item_id);
    if(favorite != null){
        var item = await Item.getItemById(item_id);
        await Item.updateFavoriteById(item_id, Number(item.number_favorites) - 1);
        res.json({ message: 'Favorite successfully deleted' });
    }else{
        res.status(400)
                .send({ message: "Error" });
    }
};