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
    var gameId = 1;
    getAllUserReviews(gameId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getAllUserReviews(gameId, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT user.username, review.review_text, review.review_score, video_game_info.name FROM review " +
            "INNER JOIN video_game_info ON video_game_info.id = review.game_id " +
            "INNER JOIN user ON review.user_id = user.id" +
            "WHERE video_game_info.id = " + gameId + ";";
//    var userQuery = "SELECT * FROM video_game_info";
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
//        rows.forEach(function (row) {
//            row.system_list = row.system.toString().split(',').map(function (value) {
//                return {system: String(value)};
//            });
//            delete row.system;
//        });
        db.get().end();
        callback(rows);

    });

}

module.exports = router;
