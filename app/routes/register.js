/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
// Get database access
var db = require('../db');

var router = express.Router();

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var user = {
        username: username,
        password: password,
        email: email
    };
    registerAccount(user, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function registerAccount(user, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
//    console.log(user);
    // # get user data
    var username = user.username;
    var password = user.password;
    var email = user.email;
    //gets the hashed password and inserts it into the database
    var hashedPass = saltHashPassword(password);
    var date = (new Date()).toISOString().substring(0, 10);
    
    var registerQuery = 'INSERT INTO user (user_type, username, user_join_date, email, salt, password) ' +
            'VALUES (1, ' + mysql.escape(username) + ', "' + date + '", ' + 
            mysql.escape(email) + ', "' + hashedPass.salt + '", "' +
            hashedPass.passwordHash + '");';

    //hash password here
    db.get().query(registerQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback();

    });

}
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
};

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}

module.exports = router;

