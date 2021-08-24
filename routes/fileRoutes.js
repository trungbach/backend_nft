'use strict';
var fs = require('fs');
const sharp = require('sharp');
var File = require('../models/files');

module.exports = function (app) {

    app.post('/upload-file', async (req, res) => {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                var timestamp = new Date().getTime()
                console.log(timestamp)
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let file = req.files.file;
                let original_name = `${timestamp}${file.name}`
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                file.mv('./public/uploads/' + file.name);
                fs.rename(`./public/uploads/${file.name}`, `./public/uploads/${original_name}`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });

                let thumb_name = `${timestamp}_thumb_${file.name}`
                await sharp(file.data).resize(200, 200).toFile(`./public/uploads/${thumb_name}`);
                
                //save file
                var file_id = await File.createFile(new File({
                    original_url: `${req.protocol}://${req.get('host')}/public/uploads/${original_name}`,
                    thumb_url: `${req.protocol}://${req.get('host')}/public/uploads/${thumb_name}`,
                    type: File.IMAGE
                }))
                var newFile = await File.getItemById(file_id);
                
                // send response
                res.send({
                    message: 'File is uploaded',
                    data: newFile
                });
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });

    app.post('/upload-other-file', async (req, res) => {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                var timestamp = new Date().getTime()
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let original_file = req.files.original_file;
                let original_name = `${timestamp}${original_file.name}`
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                original_file.mv('./public/uploads/' + original_file.name);
                fs.rename(`./public/uploads/${original_file.name}`, `./public/uploads/${original_name}`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });

                let thumb_file = req.files.thumb_file;
                let thumb_name = `${timestamp}${thumb_file.name}`
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                thumb_file.mv('./public/uploads/' + thumb_file.name);
                fs.rename(`./public/uploads/${thumb_file.name}`, `./public/uploads/${thumb_name}`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
                
                //save file
                var file_id = await File.createFile(new File({
                    original_url: `${req.protocol}://${req.get('host')}/public/uploads/${original_name}`,
                    thumb_url: `${req.protocol}://${req.get('host')}/public/uploads/${thumb_name}`,
                    type: req.body.type
                }))
                var newFile = await File.getItemById(file_id);
                
                // send response
                res.send({
                    message: 'File is uploaded',
                    data: newFile
                });
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });
};