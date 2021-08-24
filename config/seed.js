'use strict';
const User = require('../models/user');
const bcrypt = require ('bcrypt');

User.createUser({
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    username: "Admin",
    role: User.ADMIN
})

module.exports = 1