/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();

router.post('/', function (req, res) {
    var token = req.body.token;
    verifyToken(token, function (data) {
        res.json(data);
    });
});

function verifyToken(token, callback) {
//    var decoded = jwt.decode(token, 'token');
    var decoded = jwt.decode(token, process.env.AWS_TOKEN_SECRET);
    callback(decoded);
}
module.exports = router;

