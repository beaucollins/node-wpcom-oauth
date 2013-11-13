var sys = require('sys'),
    https = require('https'),
    events = require('events'),
    url = require('url'),
    querystring = require('querystring'),
    merge = require('./merge');

var TokenRequest = module.exports = function(options, requestURL, callback){

  this.options = options || {};
  // makes an http request to the 
  /*
    $curl = curl_init( "https://public-api.wordpress.com/oauth2/token" );
    curl_setopt( $curl, CURLOPT_POST, true );
    curl_setopt( $curl, CURLOPT_POSTFIELDS, array(
      'client_id' => your_client_id,
      'redirect_uri' => your_redirect_url,
      'client_secret' => your_client_secret_key,
      'code' => $_GET['code'], // The code from the previous request
      'grant_type' => 'authorization_code'
    ) );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1);
    $auth = curl_exec( $curl );
    $secret = json_decode($auth);
    $access_key = $secret->access_token;
  */
  var request_options = url.parse(requestURL),
      headers = options.headers;

    delete options['headers'];

    var body = this.body = querystring.stringify(merge({
      client_id: this.options.client_id,
      redirect_uri: this.options.redirect_uri || 'http://example.com',
      client_secret: this.options.client_secret,
      grant_type: 'authorization_code'
    }, options));

  // prepare the request options with method and headers
  request_options.method = 'POST';
  request_options.headers = merge({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length
  }, headers);

  // create the request
  var self = this,
      req = https.request(request_options, function(res){
        var body = '';
        res.on('data', function(data){
          body += data.toString();
        });
        res.on('end', function(){
          // callback(null, JSON.parse(body));
          self.emit('token', JSON.parse(body));
        });
    });
  
  if(callback) this.on('token', callback);

  req.write(body);
  req.end();
};

sys.inherits(TokenRequest, events.EventEmitter);
