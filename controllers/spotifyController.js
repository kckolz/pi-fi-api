'use strict';

// Load required packages
var responseUtil = require('../util/responseUtil'),
config = require('./../config'),
querystring = require('querystring'),
restify = require('restify'),
redis = require("redis"),
redisClient = redis.createClient(),
querystring = require("querystring"),
Q = require('q');

function login() {
  var dfd = Q.defer();
  var client = restify.createStringClient({
    url: 'https://accounts.spotify.com',
    accept: 'application/json'
  });

  client.basicAuth(config.spotifyClientId, config.spotifySecret);

  client.post('/api/token', {grant_type: 'client_credentials'}, function(err, req, res, obj) {
    if(res.statusCode === 200) {
      redisClient.set("spotifyToken", JSON.parse(obj).access_token, redis.print);
      dfd.resolve(JSON.parse(obj).access_token);
    } else {
      dfd.reject(err);
    }
  });

  return dfd.promise;
}

var SpotifyController = {

  search: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var originalRes = res,
    client;

    login().then(function(token) {
      client = restify.createJsonClient({
        url: 'https://api.spotify.com',
        headers: {
          Authorization: "Bearer "+token
        }
      });
      var searchparams = querystring.escape(req.params.query);

      client.get('/v1/search?q='+searchparams+'&type='+req.params.type,  function(err, req, res, obj) {
        if(res.statusCode === 200) {
          return responseUtil.handleSuccess(originalRes, obj);
        } else {
          return responseUtil.handleInternalError(originalRes, err);
        }
      });
    }, function(error) {
      return responseUtil.handleUnauthorizedRequest(originalRes, error);
    })

  },


  getTrack: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var originalRes = res,
    client;

    login().then(function(token) {
      client = restify.createJsonClient({
        url: 'https://api.spotify.com',
        headers: {
          Authorization: "Bearer "+token
        }
      });
      client.get('/v1/tracks/'+req.params.trackId,  function(err, req, res, obj) {
        if(res.statusCode === 200) {
          return responseUtil.handleSuccess(originalRes, obj);
        } else {
          return responseUtil.handleInternalError(originalRes, err);
        }
      });
    }, function(error) {
      return responseUtil.handleUnauthorizedRequest(originalRes, error);
    });

  }  
};

module.exports = SpotifyController