
// Module dependencies
var mysql = require('mysql');

// Databases
var PRODUCTION_DB = 'videogame',
        DEVELOPMENT_DB = 'videogame'; // can later be a test db
exports.MODE_PRODUCTION = 'mode_production';
exports.MODE_DEVELOPMENT = 'mode_development';

var state = {
    pool: null,
    mode: null
};

// Database connect function
exports.connect = function (mode) {
    state.pool = mysql.createPool({
        host: process.env.RDS_HOSTNAME || 'localhost',
        user: process.env.RDS_USERNAME || 'root',
        password: process.env.RDS_PASSWORD || 'root',
        port: process.env.RDS_PORT,
//        host: 'localhost',
//        user: 'root',
//        password: 'root',
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : DEVELOPMENT_DB
                // socketPath: '/var/run/mysqld/mysqld.sock'
    });

    state.mode = mode;
};

// This function returns a database connection
exports.get = function () {
    return state.pool;
};