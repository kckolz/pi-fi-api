'use strict';

var spotifyController = require('../controllers/spotifyController');

function SpotifyRoutes(api) {
  api.get('/api/spotify/getTrack/:trackId', spotifyController.getTrack);
  api.get('/api/spotify/search', spotifyController.search);
}

module.exports.routes = SpotifyRoutes;