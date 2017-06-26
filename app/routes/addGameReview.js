
// Module dependencies
var express = require('express');
var moment = require('moment');

// Get database access
var db = require('../db');

var router = express.Router();

// Set up the route
router.get('/', function (req, res) {
    //req.body.user.id
    var userId = 1;
    var gameId = 1;
    var userReview = req.body.review.text;
    var userRating = req.body.review.rating;

    addGameReview(userId, gameId, userReview, userRating, function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

/*function adds review based on the userId given*/
function addGameReview(userId, gameId, userReview, userRating, callback) {

    // Check your input is not null
    if (userId == undefined) {
        callback({"success": false, "message": "userId was not supplied, but is required"});
        return;
    }
    if (gameId == undefined) {
        callback({"success": false, "message": "gameId was not supplied, but is required"});
        return;
    }

    if (userReview == undefined) {
        callback({"success": false, "message": "userReview was not supplied, but is required"});
        return;
    }
    if (userRating == undefined) {
        callback({"success": false, "message": "userRating was not supplied, but is required"});
        return;
    }

    // Get and start SQL Connection
    db.connect(db.MODE_DEVELOPMENT);
    var query = "INSERT INTO review(user_id, game_id, review_text, review_score)" +
            "VALUES (" + userId + ", " + gameId + ", " + userReview + ", " + userRating + ");";
    db.get().query(query, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback({"success": true});
    });
//   
}


module.exports = router;


