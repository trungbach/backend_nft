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
                    thumb_url: `${req.protocol}://${req.get('host')}/public/uploads/${thumb_name}`
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