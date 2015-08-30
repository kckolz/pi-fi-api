'use strict';

var deviceController = require('../controllers/deviceController');

function DeviceRoutes(api) {
  api.post('/api/device/log', deviceController.log);
}

module.exports.routes = DeviceRoutes;