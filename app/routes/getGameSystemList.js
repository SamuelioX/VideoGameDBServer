/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');

// Get database access
var db = require('../db');

var router = express.Router();

router.get('/', function (req, res) {
    getGameSystemsList(function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getGameSystemsList(callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT video_game_info.name, video_game_info.developer, " +
            "video_game_info.rating, video_game_info.year, " +
            "group_concat(system_info.name) AS 'system' FROM video_game_info " +
            "LEFT JOIN game_system on video_game_info.id = game_system.game_id " +
            "LEFT JOIN system_info on system_info.id = game_system.system_id " +
            "GROUP BY video_game_info.id;";
//    var userQuery = "SELECT * FROM video_game_info";
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        rows.forEach(function (row) {
            if (row.system !== null) {
                row.system_list = row.system.toString().split(',').map(function (value) {
                    return {system: String(value)};
                });
            } else {
                row.system_list = [];
            }
            delete row.system;
        });
        db.get().end();
        callback(rows);

    });

}

module.exports = router;
