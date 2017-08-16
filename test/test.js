var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var have = chai.have;
var supertest = require("supertest");
var server = supertest.agent('http://vglist1.us-west-2.elasticbeanstalk.com');
//var testModule = require("../app/routes/zdUserRoute").test;

//test to see if unit testing works
describe('Array', function () {
    it('should start empty', function () {
        var arr = [];
        assert.equal(arr.length, 0);
    });
});

describe("Test Server Connection", function () {
    it('server should be able to connect', function (done) {
        //testing out the connection here
        server.get('/')
                .expect(200)
                .end(function (err, res) {
                    done(err);
                });
    }).timeout(120000);
});
