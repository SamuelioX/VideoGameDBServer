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

router.get('/:gamename', function (req, res) {
    var searchName = req.params.gamename;
    searchGame(searchName, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function searchGame(searchName, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data
    if (searchName == undefined) {
        callback({"success": false, "message": "searchName not supplied, but required."});
        return;
    }
    //table concats system type by '
    var userQuery = "SELECT video_game_info.name, video_game_info.id " +
            "FROM video_game_info WHERE video_game_info.name LIKE " + 
            mysql.escape('%' + searchName + '%') + ";";
//    var userQuery = "SELECT * FROM video_game_info";
    // Get database connection and run query
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

module.exports = router;