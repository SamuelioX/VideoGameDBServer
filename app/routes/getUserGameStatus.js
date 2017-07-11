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
    var gameId = req.body.gameId;
    var userId = req.body.userId;
    getUserGameStatus(gameId, userId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

router.post('/', function (req, res) {
    var userId = req.body.userId;
    var gameId = req.body.gameId;
    var statusId = req.body.statusId;
    setUserGameStatus(userId, gameId, statusId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getUserGameStatus(gameId, userId, callback) {
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
            "SELECT user_id, game_id, status_id, status_info.type FROM videogame.game_status " +
            "LEFT JOIN status_info on game_status.status_id = status_info.id " +
            "WHERE user_id = " + mysql.escape(userId) + " AND game_id = " + mysql.escape(gameId) + ";";
//    console.log(userQuery);
//    var userQuery = "SELECT * FROM video_game_info WHERE id = " + gameId;
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err || rows[0] == undefined) {
            console.log(err + " error");
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback(rows[0]);

    });

}

function setUserGameStatus(userId, gameId, statusId, callback) {
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
    if (statusId == undefined) {
        callback({"success": false, "message": "statusId not supplied, but required."});
        return;
    }
    var checkCurrentStatusQuery = "SELECT * FROM videogame.game_status " +
            "WHERE user_id = " + mysql.escape(userId) + " AND game_id = " + mysql.escape(gameId) + ";";
    db.get().query(checkCurrentStatusQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        var registerQuery = "";
        if (rows.length > 0) {
            registerQuery = 'UPDATE game_status SET status_id = ' + mysql.escape(statusId) + " " +
                    'WHERE user_id = ' + mysql.escape(userId) + ' AND game_id = ' + mysql.escape(gameId) + ';';
        } else {
            registerQuery = 'INSERT INTO game_status (user_id, status_id, game_id) ' +
                    'VALUES (' + mysql.escape(userId) + ', + ' + mysql.escape(statusId) + ', ' + mysql.escape(gameId) + ');';
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
