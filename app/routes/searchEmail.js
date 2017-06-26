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

router.get('/', function (req, res) {
    var search = req.query.email;
    searchEmail(search, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function searchEmail(searchEmail, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT username, email " +
            "FROM user WHERE user.email = " + mysql.escape(searchEmail) + ";";
//    var userQuery = "SELECT * FROM video_game_info";
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback({"available": (rows.length < 1)});
    });

}

module.exports = router;