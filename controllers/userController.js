'use strict';

// Load required packages
var OAuthUsersSchema = require('../models/user');
var responseUtil = require('../util/responseUtil');
var Q = require('q');
var uuid = require('node-uuid');
var bson = require("bson");
var objectid = bson.BSONPure.ObjectID;

var UserController = {

  createUser: function(req, res) {

    // Create a new instance of the User model
    var user = new OAuthUsersSchema();

    // Set the client properties that came from the POST data
    var isAdmin = req.body.admin;
    user.admin = isAdmin == null || isAdmin == '' ? false : isAdmin;
    user.firstname = req.body.firstName;
    user.lastname = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.password_reset_token = uuid.v1();
    user.defaultTrack = req.body.defaultTrack;
    user.tracks = [];
    user.bluetooth = req.body.bluetooth;

    OAuthUsersSchema.findOne({email:req.body.email}).then(function(user) {
      if(user) {
        return responseUtil.handleBadRequest(res, 'A user already exists with that email address.');
      }
    }, function(error) {
      return responseUtil.handleInternalError(res, error);
    })

    OAuthUsersSchema.register(user).then(function(user) {
      return responseUtil.handleSuccess(res, user);
    }, function(error) {
      return responseUtil.handleInternalError(res, error);
    })
  },

  me: function(req, res) {
    if (!req.username) {
      return res.sendUnauthenticated();
    }

    OAuthUsersSchema.findOne({'email': req.username}).then(function(user) {
      if(user) {
        return responseUtil.handleSuccess(res, user);
      } else {
        return responseUtil.handleNotFoundRequest(res, "User Not Found");
      }
    }, function(error) {
      return responseUtil.handleInternalError(res, error);
    })

  },

  getUserById: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var userId = req.params.userId;

    //must be valid mongo id format or shit blows up
    if (!objectid.isValid(userId)) {
      return responseUtil.handleBadRequest(res, 'Invalid userId format.');
    }

    // Use the User model to find all clients
    OAuthUsersSchema.findOne({'_id':userId}).then(function(user) {
      if(user) {
        return responseUtil.handleSuccess(res, user);
      } else {
        return responseUtil.handleNotFoundRequest(res, "User Not Found");
      }
    }, function(error) {
      return responseUtil.handleInternalError(res, error);
    })
  },

  getUserByName: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var username = req.params.username;

    // Use the User model to find all clients
    OAuthUsersSchema.findOne({'userName':username}).then(function(user) {
      if(user) {
        return responseUtil.handleSuccess(res, user);
      } else {
        return responseUtil.handleNotFoundRequest(res, "Failed to retrieve user");
      }
    }, function() {
      return responseUtil.handleInternalError(res, err);
    })
  },

  getUserByBluetooth: function(req, res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    var bluetooth = req.params.bluetooth;

    // Use the User model to find all clients
    OAuthUsersSchema.findOne({'bluetooth':bluetooth}).then(function(user) {
      if(user) {
        return responseUtil.handleSuccess(res, user);
      } else {
        return responseUtil.handleNotFoundRequest(res, "Failed to retrieve user");
      }
    }, function() {
      return responseUtil.handleInternalError(res, err);
    })
  },

  updateUser: function(req,res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    //must be valid mongo id format or shit blows up
    if (!objectid.isValid(req.body.id)) {
      return responseUtil.handleBadRequest(res, 'Invalid userId format.');
    }

    OAuthUsersSchema.find({'_id':req.body.id}).then(function(user) {
      if (user.length > 0) {
        user._id=req.body.id;
        user.firstname=req.body.firstName;
        user.lastname=req.body.lastName;
        user.password=req.body.password;
        user.email=req.body.email;
        user.defaultTrack = req.body.defaultTrack;

        OAuthUsersSchema.updateUser(user).then(function(user) {
          return responseUtil.handleSuccess(res, user);
        }, function(error) {
          return responseUtil.handleInternalError(res, err);
        })
      } else {
        return responseUtil.handleNotFoundRequest(res, 'Unable to find specified user.');
      }
    }, function(error) {
      return responseUtil.handleInternalError(res, err);
    })
  },

  saveTrack: function(req,res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    //must be valid mongo id format or shit blows up
    if (!objectid.isValid(req.body.id)) {
      return responseUtil.handleBadRequest(res, 'Invalid userId format.');
    }

    OAuthUsersSchema.saveTrack(req.body.id, req.body.track).then(function(user) {
      return responseUtil.handleSuccess(res, user);
    }, function(error) {
      return responseUtil.handleInternalError(res, err);
    })
  },

  saveBluetooth: function(req,res) {

    if (!req.username) {
      return res.sendUnauthenticated();
    }

    //must be valid mongo id format or shit blows up
    if (!objectid.isValid(req.body.id)) {
      return responseUtil.handleBadRequest(res, 'Invalid userId format.');
    }

    OAuthUsersSchema.saveBluetooth(req.body.id, req.body.bluetooth).then(function(user) {
      return responseUtil.handleSuccess(res, user);
    }, function(error) {
      return responseUtil.handleInternalError(res, err);
    })
  },
};

module.exports = UserController;