'use strict';
const jwt = require('jsonwebtoken');
var User = require('../models/user');

exports.list_all_user = function (req, res) {
    User.getAllUser(function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};

exports.create_a_user = async function (request, res) {
    const { public_address } = request.body;
    var new_user = new User({
        public_address: public_address,
        nonce: `${Math.floor(Math.random() * 1000000)}`,
        username: "Unknown Name"
    })
    await User.createUser(new_user, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
    res.send({ message: "Success" })
};

exports.token_by_address = async function (request, res) {
    const { public_address } = request.body;
    var user = await User.findByAddress(public_address);
    var token = await jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { noTimestamp: true, expiresIn: process.env.TIME_TOKEN });
    res.send({ message: "Success", data: user, token })
};

exports.check_public_address = async function (request, res) {
    const { public_address } = request.body;
    const user = await User.findByAddress(public_address);
    if (user) {
        res.send({ message: "Success", data: user })
        return
    }
    var new_user = new User({
        public_address: public_address,
        nonce: `${Math.floor(Math.random() * 1000000)}`,
        username: "Unknown Name"
    })
    var id = await User.createUser(new_user);
    var newUser = await User.findById(id);
    res.send({ message: "Success", data: newUser })
}

exports.signature_verification = async function (request, res) {
    const { public_address, signature } = request.body;
    const user = await User.findByAddress(public_address);
    const msg = user.nonce;
    // We now are in possession of msg, public_address and signature. We
    // can perform an elliptic curve signature verification with ecrecover
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
    });
    console.log(address)
    // The signature verification is successful if the address found with
    // ecrecover matches the initial public_address
    if (address.toLowerCase() === public_address.toLowerCase()) {
        await User.updateById(user.id, { nonce: Math.floor(Math.random() * 1000000) });
        var token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TIME_TOKEN });
        res.send({ message: "Success", data: token })
    } else {
        res
            .status(401)
            .send({ error: 'Signature verification failed' });
    }
};