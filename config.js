'use strict';

var argv = require('yargs').argv;

exports.api = {
  name: 'pi-fi',
  version: '0.1.1'
};

exports.limiter = {
  defaultBurstRate: 50,
  defaultRatePerSec: 0.5,
};

if (!argv.production) {
  exports.environment = {
    name: 'development',
    port: 1337
  };
} else {
  exports.environment = {
    name: 'production',
    port: 3000
  };
}
 
exports.mongo = {
  uri: 'mongodb://localhost:27017/test'
}

exports.seedDB = false;

exports.spotifyClientId = '8d9eb9df9b6a46dfb56c2814033d8368';
exports.spotifySecret = '79984362550a4818a34c802f7ec3e06b';
exports.spotifyRedirectUri = 'http://localhost:1337/api/spotify/callback';