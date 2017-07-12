/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');

// Get database access
var db = require('../db');
var mysql = require('mysql');
var router = express.Router();

router.get('/:userId', function (req, res) {
    var userId = req.params.userId;
    getUserDetails(userId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

router.get('/', function (req, res) {
    getUserList(function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getUserList(callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT username FROM user;";

    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback(rows);

    });

}
function getUserDetails(userId, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data
    if (userId == null || userId == undefined) {
        callback({"success": false, "message": "there is no user by that name"});
        return;
    }
    //table concats system type by '
    var userQuery = "SELECT username, user_join_date, email FROM user " +
            "WHERE user.id = " + mysql.escape(userId);
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback(rows[0]);

    });

}

module.exports = router;

