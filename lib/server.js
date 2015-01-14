var jayson = require('jayson');

var Server = function (methods) {
  var self = this;

  var wrappedMethods = {};
  Object.keys(methods).forEach(function (key) {
    wrappedMethods[key] = self._wrapMethod(methods[key]);
  });

  this._jaysonServer = jayson.server(wrappedMethods);
};

Server.prototype.listen = function (port) {
  // Unfortunately, we can't use this._jaysonServer.http().listen because we
  // need access to the raw HTTP request in order to detect security parameters.
  this._jaysonServer.http().listen(port || +process.env.PORT);
};

Server.prototype._wrapMethod = function (method) {
  var self = this;
  return function handleCodiusRpcCall() {
    method.apply(self, arguments);
  }
};

exports.Server = Server;
