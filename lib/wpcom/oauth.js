var Client = require('./oauth/client');

var createClient = function(options){
    return new Client(options);
}

module.exports = createClient;

module.exports.Client = Client;
module.exports.TokenRequest = require('./oauth/token_request');

module.exports.getAuthURL = function(options){
    var client = new Client(options);
    return client.getAuthURL();
}

module.exports.requestToken = function(options, callback){
    var client = new Client(options);
    return client.requestToken(options, callback);
}

module.exports.parseCode = function(url){
  var access_code = Client.prototype.parseCode(url);
  return access_code;
}