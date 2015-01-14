var jayson = require('jayson');

var Peer = function (peerInfo) {
  this.hostname = peerInfo.split(':')[0];
  this.port = peerInfo.split(':')[1];
};

Peer.prototype.getClient = function () {
  if (!this._client) {
    this._client = jayson.client.http({
      hostname: this.hostname,
      port: this.port
    });
  }

  return this._client;
};

Peer.prototype.request = function (method, params, callback) {
  this.getClient().request(method, params, callback);
};

exports.Peer = Peer;
