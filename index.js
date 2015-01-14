// Expose dependencies
var jayson = exports._jayson = require('jayson');
var async = exports._async = require('async');

// Expose classes
var Peer = exports.Peer =
  require('./lib/peer').Peer;
var Server = exports.Server =
  require('./lib/server').Server;

var group = process.env.CODIUS_GROUP.split(',');
var hostId = group.indexOf(process.env.CODIUS_SELF);

group = group.map(function (peerInfo) {
  return new Peer(peerInfo);
});
var self = group[hostId];

exports.group = group;
exports.self = self;
exports.hostId = hostId;
exports.host = process.env.CODIUS_SELF;

exports.getPeer = function (peerId) {
  return group[peerId];
};

exports.broadcastGroup = function (method, params) {
  var everyoneElse = group.filter(function (peer) {
    return peer !== self;
  });
  async.map(everyoneElse, function (peer, callback) {
    peer.request(method, params, callback);
  }, function (err, results) {
    if ('function' === typeof callback)
      callback(err, results);
    console.log(err, results);
  });
};

exports.server = function (methods) {
  return new Server(methods);
};
