var https = require('https'),
    url = require('url'),
    querystring = require('querystring'),
    events = require('events'),
    sys = require('sys'),
    merge = require('./merge'),
    TokenRequest = require('./token_request');

var WORDPRESS_API_HOST = 'public-api.wordpress.com',
    AUTHORIZE_PATH = 'oauth2/authorize',
    TOKEN_PATH = 'oauth2/token';

// app_id and secret
var Client = module.exports = function(options){
  this.options = options || {};
};

Client.WORDPRESS_API_HOST = WORDPRESS_API_HOST;

Client.prototype.getURL = function(path, query){
  return url.format({
    protocol: 'https',
    hostname: WORDPRESS_API_HOST,
    pathname: path,
    query: query
  });
};

// https://public-api.wordpress.com/oauth2/authorize?client_id=
// URL to send the user to
Client.prototype.getAuthURL = function(){
  return this.getURL(AUTHORIZE_PATH, {
    client_id:     this.options.client_id,
    redirect_uri:  this.options.redirect_uri,
    response_type: 'code'
  });
};

Client.prototype.getTokenURL = function(){
  return this.getURL(TOKEN_PATH);
};

// Redirect URI is provided with a code querystring parameter used
// to exchange for an auth token
Client.prototype.parseCode = function(redirect_url){
  var parsed = url.parse(redirect_url, true); // true parses querystring
  return parsed.query.code;
};

// Grant type is password
Client.prototype.requestToken = function(options, callback){
  return new TokenRequest(merge(this.options, options), this.getTokenURL(), callback);
};

