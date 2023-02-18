'use strict';
var fs = require('fs');
var path = require('path');
const sharp = require('sharp');
const { compareImages, compareDocuments, convertPdfToImg, compareImagesData } = require('../helpers/file-helper');
var File = require('../models/files');
const MAX_PERCENT = 80;

module.exports = function (app) {

    app.post('/upload-file-item', async (req, res) => {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let file = req.files.file;
                let isDuplicate = false;

                // tính % giống nhau của file với các ảnh đã tải lên.
                const dir = './public/uploads/image-items';
                isDuplicate = await compareAllImage(dir, file);

                if(isDuplicate === false) {
                    var original_name = optimalName(file.name)
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    await file.mv('./public/uploads/image-items/' + original_name);

                    let thumb_name = optimalThumbName()
                    await sharp(file.data).resize({
                        height: 200,
                        kernel: sharp.kernel.nearest,
                        fit: 'contain',
                        background: { r: 255, g: 255, b: 255, alpha: 0.5 }
                    }).toFile(`./public/uploads/thumbs/${thumb_name}`);
                    
                    //save file
                    var file_id = await File.createFile(new File({
                        original_url: `${req.protocol}://${req.get('host')}/public/uploads/image-items${original_name}`,
                        thumb_url: `${req.protocol}://${req.get('host')}/public/uploads/thumbs/${thumb_name}`,
                        type: File.IMAGE
                    }))
                    var newFile = await File.getItemById(file_id);
    
                    // send response
                    res.send({
                        message: 'File is uploaded',
                        data: newFile
                    });
                } else {
                    res.status(400).send({
                        message: 'File is duplicate!'
                    });
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });

    app.post('/upload-other-file-item', async (req, res) => {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //Use the name of the input field (i.e. "file") to retrieve the uploaded file
                let original_file = req.files.original_file;
                const type = Number(req.body.type);
                console.log('req file', req.files);
                var original_name = optimalName(original_file.name)
                
                // tính % giống nhau file text hoặc pdf với các file đã upload
                let isDuplicate = false;
                if(type === File.DOCUMENT) {
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    await original_file.mv('./public/uploads/document/' + original_name);

                    const dir = './public/uploads/document';
                    isDuplicate = compareAllFiles(dir, original_name);
                } else if(type === File.PDF) {
                    await original_file.mv('./public/uploads/pdf/' + original_name);

                    const dir = './public/uploads/pdf';
                    isDuplicate = await compareAllPdfs(dir, original_name);
                }
                if(!isDuplicate) {
                    const typeHasThumb = [File.AUDIO, File.VIDEO];
                    const thumb_name = optimalThumbName()
                    if(typeHasThumb.includes(type)){
                        let thumb_file = req.files.thumb_file;
                        await original_file.mv('./public/uploads/' + original_name);
                        await sharp(thumb_file.data).resize({
                            height: 200,
                            kernel: sharp.kernel.nearest,
                            fit: 'contain',
                            background: { r: 255, g: 255, b: 255, alpha: 0.5 }
                        }).toFile(`./public/uploads/${thumb_name}`);
                    }
                    //save file
                    const file_id = await File.createFile(new File({
                        original_url: `${req.protocol}://${req.get('host')}/public/uploads/${original_name}`,
                        thumb_url: typeHasThumb.includes(type) ? `${req.protocol}://${req.get('host')}/public/uploads/${thumb_name}`: '',
                        type: type
                    }))
                    var newFile = await File.getItemById(file_id);
                    
                    // send response
                    res.send({
                        message: 'File is uploaded',
                        data: newFile
                    });
                } else {
                    res.status(400).send({
                        message: 'File is duplicate!'
                    });
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).send(err);
        }
    });

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
                console.log('chua ok')

                await sharp(file.data).resize({
                    height: 200,
                    kernel: sharp.kernel.nearest,
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0.5 }
                }).toFile(`./public/uploads/thumbs/${thumb_name}`);
                console.log('ok')
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

     function compareAllFiles(dir, original_name) {
        let isDuplicate = false;
        const filenames = fs.readdirSync(dir);
        for (let i = 0; i < filenames.length; i++) {
            let uploaded = filenames[i];
            const pathToFileCompare = path.resolve(dir, uploaded);
            const currentPath = path.resolve(dir, original_name);
            if (pathToFileCompare !== currentPath) {
                const percentSimilarity = compareDocuments(currentPath, pathToFileCompare);
                console.log('percentSimilarity', percentSimilarity);
                if (percentSimilarity > MAX_PERCENT) {
                    isDuplicate = true;

                    // remove current file in upload document.
                    fs.unlink(currentPath, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                    console.log('isDuplicate', isDuplicate);
                    break;
                }
            }
        }
        return isDuplicate;
    }

    async function compareAllPdfs(dir, original_name) {
        let isDuplicate = false;
        const currentPath = path.resolve(dir, original_name);
        const resp = await convertPdfToImg(currentPath);
        const currentConverted = resp.message;
        const outputDir = resp.outputDir;
        console.log('outputDir', outputDir);
        const convertedPdf = fs.readdirSync('./public/uploads/converted-pdf');
        for(let i = 0; i < convertedPdf.length; i++) {
            const dir = './public/uploads/converted-pdf/' + convertedPdf[i];
            const filenames = fs.readdirSync(dir);
            console.log('filenames', filenames);
            if(currentConverted.length == filenames.length) {
                let avgPercentSimilarity = 0;

                for(let j = 0; j < currentConverted.length; j++) {
                    let pathCompare = dir + '/' + filenames[j]
                    if(currentConverted[j].path !== pathCompare) {
                        avgPercentSimilarity += await compareImages(currentConverted[j].path, pathCompare);
                    }
                }
                avgPercentSimilarity /= filenames.length;
                
                console.log('avgPercentSimilarity', avgPercentSimilarity);
                if(avgPercentSimilarity > MAX_PERCENT) {
                    isDuplicate = true;
                    
                }
            }
        }
        if(isDuplicate) {
            fs.unlink(currentPath, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            fs.rmSync(path.resolve(outputDir), { recursive: true, force: true });
        }
        return isDuplicate;
    }

    async function compareAllImage(dir, file) {
        let isDuplicate = false;
        const filenames = fs.readdirSync(dir);
        for (let i = 0; i < filenames.length; i++) {
            let uploaded = list[i];
            const pathToFileCompare = path.resolve(dir, uploaded);
            const percentSimilarity = await compareImagesData(file.data, pathToFileCompare);
            console.log('percentSimilarity', percentSimilarity);
            if(percentSimilarity > MAX_PERCENT) {
                isDuplicate = true;
                break;
            } 
        }
        return isDuplicate;
    }
};