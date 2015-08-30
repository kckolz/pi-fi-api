'use strict';

var userController = require('../controllers/userController');

function UserRoutes(api) {
  api.post('/api/user', userController.createUser);
  api.get('/api/user/:userId', userController.getUserById);
  api.put('/api/user', userController.updateUser);
  api.get('/api/user', userController.me);
  api.put('/api/user/track', userController.saveTrack);
  api.get('/api/user/bluetooth/:bluetooth', userController.getUserByBluetooth);
  api.put('/api/user/bluetooth', userController.saveBluetooth);
}

module.exports.routes = UserRoutes;