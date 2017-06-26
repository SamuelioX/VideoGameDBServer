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
var jwt = require('jwt-simple');
var router = express.Router();

router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user = {
        username: username,
        password: password
    };
    authorizeAccount(user, function (data) {
//        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function authorizeAccount(user, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
//    console.log(user);
    // # get user data
    var username = user.username;
    var password = user.password;
    //gets the hashed password and inserts it into the database
    var userQuery = "SELECT id, username, email, salt, password " +
            "FROM user WHERE (user.username = " + mysql.escape(username) + " OR user.email = " +
            mysql.escape(username) + ');';
    //hash password here
    db.get().query(userQuery, function (err, rows) {
        if (err || rows[0] == undefined) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        var currUser = {
            userid: rows[0].id,
            username: rows[0].username,
            //set to 7 days expiration
            expire: 10080 * 60
        };
        var hashedPass = sha512(password, rows[0].salt);
        if(hashedPass.passwordHash == rows[0].password){
            var token = jwt.encode(currUser, process.env.AWS_TOKEN_SECRET);
//            var token = jwt.encode(currUser, 'token');
            callback({"success": true, "token": token});
        } else {
            callback({"success": false});
        }
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
//
