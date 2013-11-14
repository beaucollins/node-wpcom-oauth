var assert = require('assert');
var nock = require('nock');
var oauth = require('../');
var merge = require('../lib/wpcom/oauth/merge');
var APP_ID = "MOCK_ID";
var REDIRECT_URI = "MOCK_URI";
var SECRET = "MOCK_SECRET";
var CONFIG = {client_id: APP_ID, redirect_uri: REDIRECT_URI, client_secret: SECRET };


describe('oauth', function(){

    it('should build auth url', function(){
        var url = "https://public-api.wordpress.com/oauth2/authorize?client_id=MOCK_ID&redirect_uri=MOCK_URI&response_type=code";
        assert.equal(url, oauth.getAuthURL(CONFIG));
    });

    it('should exchange token for access code', function(done){

        nock("https://public-api.wordpress.com")
            .post('/oauth2/token')
            .reply(200, {
                "access_token": "YOUR_API_TOKEN",
                "blog_id": "blog id",
                "blog_url": "blog url",
                "token_type": "bearer"
            });

        var options = merge({'grant_type' : 'authorization_code', 'code' : 'MOCK_CODE'}, CONFIG);

        var request = oauth.requestToken(options, function(token){
            done();
        });

        assert.deepEqual(options, request.options);

    });

});