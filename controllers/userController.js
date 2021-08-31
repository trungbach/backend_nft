'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ethereumjs = require('ethereumjs-util');
const ethSig = require('eth-sig-util');
const buffer = require('buffer');
const Buffer = buffer.Buffer;
const recoverPersonalSignature = ethSig.recoverPersonalSignature

exports.list_all_user = async function (req, res) {
    const { user_id, query } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        var total_items = await User.countAllUser(query)
        User.getAllUser(query, function (err, task) {
            if (err)
                res.status(400)
                    .send({ message: "Error", data: err });
            res.send({ message: "Success", data: task, total_items })
        });
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
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
    const msg = `I am signing my one-time nonce: ${user.nonce}`
    // We now are in possession of msg, public_address and signature. We
    // can perform an elliptic curve signature verification with ecrecover
    const msgBufferHex = ethereumjs.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
        data: msgBufferHex,
        sig: signature,
    });
    console.log(address)
    // The signature verification is successful if the address found with
    // ecrecover matches the initial public_address
    if (address.toLowerCase() === public_address.toLowerCase()) {
        await User.updateNonceById(user.id, { nonce: Math.floor(Math.random() * 1000000) });
        var token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TIME_TOKEN });
        res.send({ message: "Success", data: token })
    } else {
        res
            .status(401)
            .send({ error: 'Signature verification failed' });
    }
};

exports.update_profile = async function (request, res) {
    const { username, avatar_id, cover_id, description, email } = request.body;
    var user = await User.updateProfile(request.user_id, username, avatar_id, cover_id, description, email);
    user = await User.getProfileById(request.user_id)
    res.send({ message: "Success", data: user })
};

exports.get_profile = async function (request, res) {
    var user = await User.getProfileById(request.params.userId);
    res.send({ message: "Success", data: user })
};

exports.admin_login = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send({ message: "All input is required" });
        }
        const user = await User.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            var token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TIME_TOKEN });
            user.token = token;
            res.send({ message: "Success", data: user })
        }
        res.status(400).send({ message: "Invalid Credentials" });
    } catch (err) {
        console.log(err);
    }
};

exports.summary_weeks_of_year = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await User.getUserInWeekOfYear(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.summary_days_of_month = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await User.getUserInDayOfMonth(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.summary_months_of_year = async function (req, res) {
    const { user_id } = req
    var user = await User.findById(user_id);
    if (user.role == User.ADMIN) {
        const summary = await User.getUserInMonthsOfYear(req.query.start_time);
        res.send({ message: "Success", data: summary })
    } else {
        res.status(400).send({ message: "You isn't a admin" });
    }
};

exports.rankings = function (req, res) {
    User.updateInTime(req.query, function (err, task) {
        if (err)
            res.status(400)
                .send({ message: "Error", data: err });
        res.send({ message: "Success", data: task })
    });
};