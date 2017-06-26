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
    getUserList(function (data) {
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });
});

function getUserList(callback) {
    // Connect to the database
    db.connect(db.MODE_DEVELOPMENT);
    // # get user data

    //table concats system type by '
    var userQuery = "SELECT username FROM user;";
    
    db.get().query(userQuery, function (err, rows) {
        if (err) {
            console.log(err);
            callback({"success": false, "message": "something went wrong in the db."});
            return;
        }
        db.get().end();
        callback(rows);

    });

}

module.exports = router;

