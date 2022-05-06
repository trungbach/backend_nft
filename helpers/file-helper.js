const fs = require("fs");
const blockhash = require("blockhash-core");
const { imageFromBuffer, getImageData } = require("@canvas/image");
const stringSimilarity = require("string-similarity");
const path = require("path");
const pdf2img = require("pdf2img");

async function hash(imgPath) {
  try {
    const data = await readFile(imgPath);
    const hash =  blockhash.bmvbhash(getImageData(data), 8);
    return hexToBin(hash);
  } catch (error) {
    console.log(error);
  }
}

async function hashData(data) {
  try {
    const image = await imageFromBuffer(data);
    const hash = blockhash.bmvbhash(getImageData(image), 8);
    return hexToBin(hash);
  } catch (error) {
    console.log(error);
  }
}

function hexToBin(hexString) {
  const hexBinLookup = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    a: "1010",
    b: "1011",
    c: "1100",
    d: "1101",
    e: "1110",
    f: "1111",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };
  let result = "";
  for (i = 0; i < hexString.length; i++) {
    result += hexBinLookup[hexString[i]];
  }

  return result;
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(imageFromBuffer(data));
    });
  });
}

function calculateSimilarity(hash1, hash2) {
  // Hamming Distance
  let similarity = 0;
  hash1Array = hash1.split("");
  hash1Array.forEach((bit, index) => {
    hash2[index] === bit ? similarity++ : null;
  });
  return parseInt((similarity / hash1.length) * 100);
}

async function compareImagesData(dataFile, pathCompare) {
  const hash1 = await hashData(dataFile);
  const hash2 = await hash(pathCompare);
  console.log('hash1', hash1);
  console.log('hash2', hash2);
  return calculateSimilarity(hash1, hash2);
}

async function compareImages(dataFile, pathCompare) {
  const hash1 = await hash(dataFile);
  const hash2 = await hash(pathCompare);
  return calculateSimilarity(hash1, hash2);
}


// compare document ( type File.DOCUMENT)
function compareDocuments(pathCompare1, pathCompare2) {
  try {
    const inputPath1 = path.resolve(__dirname, pathCompare1);
    const file1Str = fs.readFileSync(inputPath1, "utf8");
    // console.log("file1Str: ", file1Str);

    const inputPath2 = path.resolve(__dirname, pathCompare2);

    const file2Str = fs.readFileSync(inputPath2, "utf8");
    // console.log("file2Str: ", file2Str);

    var similarity = stringSimilarity.compareTwoStrings(file1Str, file2Str);
    return similarity * 100; // percent
  } catch (err) {
    console.error(err);
  }
}

function convertPdfToImg(inputPath, callback) {
  let pdfName = optimalPdfName();
  let dirOutputs = './public/uploads/converted-pdf/';
  let outputDir  = dirOutputs + pdfName;
  pdf2img.setOptions({
    type: "png", // png or jpg, default jpg
    size: 1024, // default 1024
    density: 600, // default 600
    // outputdir: dirOutput + `/converted-pdf/${pdfName}`, // output folder, default null (if null given, then it will create folder name same as file name)
    outputdir: outputDir, // output folder, default null (if null given, then it will create folder name same as file name)
    outputname: "test", // output file name, dafault null (if null given, then it will create image name same as input name)
    page: null, // convert selected page, default null (if null given, then it will convert all pages)
  });
  
  // convert and save in ouput folder.
  return new Promise((resolve, reject) => {
    pdf2img.convert(inputPath, function (error, resp) {
      if (error) {
        console.log("Something went wrong: " + error);
        reject(error);
        return;
      }
      resp.outputDir = outputDir;
      resolve(resp);
    });
  })
 
}

function optimalPdfName(){
  var timestamp = new Date().getTime()
  return `${timestamp}_pdf`
}


module.exports = {
  compareImages,
  compareDocuments,
  convertPdfToImg,
  compareImagesData
};
