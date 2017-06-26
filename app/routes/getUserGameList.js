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
    var userId = req.query.userId;
    getUserGameList(userId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getUserGameList(userId, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT game_status.status_id, game_status.game_id, status_info.type, video_game_info.name, review.review_score FROM game_status " +
            "INNER JOIN status_info ON game_status.status_id = status_info.id " +
            "INNER JOIN video_game_info ON game_status.game_id = video_game_info.id " +
            "INNER JOIN review ON review.game_id = video_game_info.id " +
            "WHERE review.user_id = " + userId + ";";
//    var userQuery = "SELECT * FROM video_game_info";
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db." + err});
            return;
        }
        db.get().end();
        callback(rows);

    });

}

module.exports = router;
