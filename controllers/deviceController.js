'use strict';

// Load required packages
var responseUtil = require('../util/responseUtil');
var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var DeviceController = {

  log: function(req, res) {
    var log = req.body.deviceId + ',' + req.body.time + "\n";
    fs.appendFile(appDir+'/deviceLog.csv', log, function (err) {
      if(err) {
        return responseUtil.handleInternalError(err, "Failed to save log");
      } else {
        return responseUtil.handleSuccess(res, "Log saved");
      }
    });
    
  }
};

module.exports = DeviceController;