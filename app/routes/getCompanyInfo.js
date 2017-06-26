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
    var companyId = req.query.companyId;
    getCompanyInfo(companyId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getCompanyInfo(companyId, callback) {
    console.log("Invoked: getCompanyInfo");

    // Check that input is not null
    if (companyId == undefined) {
        callback({"success": false, "message": "companyId not supplied, but required."});
        return;
    }
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery =
            "SELECT video_game_info.*, group_concat(system_info.name) AS 'System Name', " +
            "system_info.id AS 'System ID', " +
            "developer.name AS 'developer', " +
            "publisher.name AS 'publisher', " +
            "genre_info.genre AS 'genre' " +
            "FROM video_game_info " +
            "LEFT JOIN game_system on video_game_info.id = game_system.game_id " +
            "LEFT JOIN system_info on system_info.id = game_system.system_id " +
            "LEFT JOIN game_developer on video_game_info.id = game_developer.game_id " +
            "LEFT JOIN game_publisher on video_game_info.id = game_publisher.game_id " +
            "LEFT JOIN game_genre on video_game_info.id = game_genre.game_id " +
            "LEFT JOIN developer on developer.id = game_developer.developer_id " +
            "LEFT JOIN publisher on publisher.id = game_publisher.publisher_id " +
            "LEFT JOIN genre_info on genre_info.id = game_genre.genre_id " +
            "WHERE video_game_info.id = " + companyId + " " +
            "GROUP BY video_game_info.id;";
//    var userQuery = "SELECT * FROM video_game_info WHERE id = " + companyId;
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }

//        rows.forEach(function (row) {
//            if (row.system !== null) {
//                row.system_list = row.system.toString().split(',').map(function (value) {
//                    return {system: String(value)};
//                });
//            } else {
//                row.system_list = [];
//            }
//            delete row.system;
//        });
        db.get().end();
        callback(rows[0]);

    });

}

module.exports = router;
