/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var crypto = require('crypto');
var mysql = require('mysql');
// Get database access
var db = require('../db');

var router = express.Router();

router.post('/', function (req, res) {
    var userId = req.body.userId;
    var gameId = req.body.gameId;
    var scoreId = req.body.scoreId;
    setUserGameRating(userId, gameId, scoreId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function setUserGameRating(userId, gameId, scoreId, callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
//    console.log(user);
    var checkCurrentStatusQuery = "SELECT * FROM videogame.review " +
            "WHERE user_id = " + userId + " AND game_id = " + gameId + ";";
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

