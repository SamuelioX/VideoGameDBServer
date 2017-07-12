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

router.get('/user/:userId/game/:gameId', function (req, res) {
    var gameId = req.params.gameId;
    var userId = req.params.userId;
    getUserGameReview(gameId, userId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

router.post('/', function (req, res) {
    var userId = req.body.userId;
    var gameId = req.body.gameId;
    var scoreId = req.body.scoreId;
//    var reviewText = req.body.reviewText;
    setUserGameReview(userId, gameId, scoreId, function (data) {
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
            "WHERE user_id = " + mysql.escape(userId) + " AND game_id = " + mysql.escape(gameId) + ";";
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

function setUserGameReview(userId, gameId, scoreId, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
//    console.log(user);
    if (gameId == undefined) {
        callback({"success": false, "message": "gameId not supplied, but required."});
        return;
    }
    if (userId == undefined || userId == null) {
        callback({"success": false, "message": "userId not supplied, but required."});
        return;
    }
    if (scoreId == undefined) {
        callback({"success": false, "message": "scoreId not supplied, but required."});
        return;
    }
    var checkCurrentStatusQuery = "SELECT * FROM videogame.review " +
            "WHERE user_id = " + mysql.escape(userId) + " AND game_id = " + mysql.escape(gameId) + ";";
    db.get().query(checkCurrentStatusQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        var registerQuery = "";
        if (rows.length > 0) {
            registerQuery = 'UPDATE review SET review_score = ' + scoreId + " " +
                    'WHERE user_id = ' + userId + ' AND game_id = ' + gameId + ';';
        } else {
            registerQuery = 'INSERT INTO review (user_id, review_score, game_id) ' +
                    'VALUES (' + userId + ', + ' + scoreId + ', ' + gameId + ');';
        }
        console.log(registerQuery);
        db.get().query(registerQuery, function (err, rows) {
            if (err) {
                console.log(err);
                callback({"success": false, "message": "something went wrong in the db."});
                return;
            }
            db.get().end();
            callback();
        });
    });
}
module.exports = router;
