/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');

// Get database access
var db = require('../db');

var router = express.Router();

router.post('/', function (req, res) {
    var gameId = req.body.gameId;
    var userId = req.body.userId;
    getUserGameReview(gameId, userId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getUserGameReview(gameId, userId, callback) {
//    console.log("Invoked: getGameInfo");

    // Check that input is not null
    if (gameId == undefined) {
        callback({"success": false, "message": "gameId not supplied, but required."});
        return;
    }
    if (userId == undefined || userId == null) {
        callback({"success": false, "message": "userId not supplied, but required."});
        return;
    }
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery =
            "SELECT review_text, review_score FROM videogame.review " +
            "WHERE user_id = " + userId + " AND game_id = " + gameId + ";";
//    console.log(userQuery);
//    var userQuery = "SELECT * FROM video_game_info WHERE id = " + gameId;
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err || rows[0] == undefined) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback(rows[0]);

    });

}

module.exports = router;
