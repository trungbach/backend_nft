'use strict';
var fs = require('fs');

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
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                file.mv('./public/uploads/' + file.name);
                fs.rename(`./public/uploads/${file.name}`, `./public/uploads/${timestamp}${file.name}`, function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: `${timestamp}${file.name}`,
                        mimetype: file.mimetype,
                        size: file.size,
                        path: `${req.protocol}://${req.get('host')}/public/uploads/${timestamp}${file.name}`
                    }
                });
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });
};