'use strict';
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
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let file = req.files.file;
                var original_name = optimalName(file.name)
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await file.mv('./public/uploads/images/' + original_name);

                let thumb_name = optimalThumbName()

                await sharp(file.data).resize({
                    height: 200,
                    kernel: sharp.kernel.nearest,
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0.5 }
                }).toFile(`./public/uploads/thumbs/${thumb_name}`);

                //save file
                var file_id = await File.createFile(new File({
                    original_url: `${req.protocol}://${req.get('host')}/public/uploads/images/${original_name}`,
                    thumb_url: `${req.protocol}://${req.get('host')}/public/uploads/thumbs/${thumb_name}`,
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
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let original_file = req.files.original_file;
                var original_name = optimalName(original_file.name)
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await original_file.mv('./public/uploads/files/' + original_name);

                if(req.body.type != File.GIF){
                    let thumb_file = req.files.thumb_file;
                    var thumb_name = optimalThumbName()
                    await sharp(thumb_file.data).resize({
                        height: 200,
                        kernel: sharp.kernel.nearest,
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: 0.5 }
                    }).toFile(`./public/uploads/thumbs/${thumb_name}`);
                }
                
                //save file
                var file_id = await File.createFile(new File({
                    original_url: `${req.protocol}://${req.get('host')}/public/uploads/files/${original_name}`,
                    thumb_url: req.body.type != File.GIF ? `${req.protocol}://${req.get('host')}/public/uploads/thumbs/${thumb_name}`: '',
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

    function optimalName(str){
        var timestamp = new Date().getTime()
        return `${timestamp}_${str.replace(/[^a-zA-Z1-9.]/g, "")}`
    }

    function optimalThumbName(){
        var timestamp = new Date().getTime()
        return `${timestamp}_thumb.jpeg`
    }
};