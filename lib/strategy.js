var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.instagram.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.instagram.com/oauth/access_token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'instagram';
}

util.inherits(Strategy, OAuth2Strategy);
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://graph.instagram.com/me?fields=id,username', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    try {
      var json = JSON.parse(body);
      var profile = { provider: 'instagram' };
      profile.id = json.id;
      profile.username = json.username;
      console.log(json)
      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

module.exports = Strategy;
