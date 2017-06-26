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
    var gameId = req.query.gameId;
    getGameInfo(gameId, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getGameInfo(gameId, callback) {
    console.log("Invoked: getGameInfo");

    // Check that input is not null
    if (gameId == undefined) {
        callback({"success": false, "message": "gameId not supplied, but required."});
        return;
    }
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery =
            "SELECT video_game_info.*, group_concat(system_info.name) AS 'system', " +
            "system_info.id AS 'system ID', " +
            "company.name AS 'developer', " +
            "comp.name AS 'publisher', " +
            "group_concat(genre_info.genre) AS 'genre' " +
            "FROM video_game_info " +
            "LEFT JOIN game_system on video_game_info.id = game_system.game_id " +
            "LEFT JOIN system_info on system_info.id = game_system.system_id " +
            "LEFT JOIN game_developer on video_game_info.id = game_developer.game_id " +
            "LEFT JOIN game_publisher on video_game_info.id = game_publisher.game_id " +
            "LEFT JOIN game_genre on video_game_info.id = game_genre.game_id " +
            "LEFT JOIN company on company.id = game_developer.company_id " +
            "LEFT JOIN company as comp on comp.id = game_publisher.company_id " +
            "LEFT JOIN genre_info on genre_info.id = game_genre.genre_id " +
            "WHERE video_game_info.id = " + gameId + " " +
            "GROUP BY video_game_info.id;";
//    console.log(userQuery);
//    var userQuery = "SELECT * FROM video_game_info WHERE id = " + gameId;
    // Get database connection and run query
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }

        rows.forEach(function (row) {
            if (row.system !== null) {
//                console.log(row.system);
                row.system_list = row.system.toString().split(',').map(function (value) {
                    return {system: String(value)};
                });
            } else {
                row.system_list = [];
            }
            delete row.system;
        });
        rows.forEach(function (row) {
            if (row.genre !== null) {
                row.genre_list = row.genre.toString().split(',').map(function (value) {
                    return {genre: String(value)};
                });
            } else {
                row.genre_list = [];
            }
            delete row.genre;
        });
        rows.forEach(function (row) {
            if (row.release_date !== null) {
                var dateParts = formatDate(row.release_date);
                row.release_date = dateParts;
            }
        });
        var totalReviewQuery = "SELECT videogame.review.game_id, Count(*) as 'total_reviews', sum(review_score) as 'total_score'" +
                "FROM videogame.review WHERE videogame.review.game_id = " + gameId + ";";
        db.get().query(totalReviewQuery, function (err, reviewRows) {
            rows[0].total_rating = reviewRows[0].total_reviews;
            rows[0].avg_score = (reviewRows[0].total_score / reviewRows[0].total_reviews) / 1.00;
//            console.log(rows[0].avg_score);
            callback(rows[0]);
        });


    });

    function formatDate(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }
}

module.exports = router;
