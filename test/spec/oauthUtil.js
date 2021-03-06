define(function(require) {
  var OktaAuth = require('OktaAuth');
  var oauthUtil = require('../../lib/oauthUtil');
  var util = require('../util/util');
  var wellKnown = require('../xhr/well-known');

  describe('getWellKnown', function() {
    util.itMakesCorrectRequestResponse({
      title: 'caches response and uses cache on subsequent requests',
      setup: {
        calls: [
          {
            request: {
              method: 'get',
              uri: '/.well-known/openid-configuration'
            },
            response: 'well-known'
          }
        ],
        time: 1449699929
      },
      execute: function(test) {
        localStorage.clear();
        return oauthUtil.getWellKnown(test.oa)
        .then(function() {
          return oauthUtil.getWellKnown(test.oa);
        });
      },
      expectations: function() {
        var cache = localStorage.getItem('okta-cache-storage');
        expect(cache).toEqual(JSON.stringify({
          'https://auth-js-test.okta.com/.well-known/openid-configuration': {
            expiresAt: 1449786329,
            response: wellKnown.response
          }
        }));
      }
    });
    util.itMakesCorrectRequestResponse({
      title: 'uses cached response',
      setup: {
        time: 1449699929
      },
      execute: function(test) {
        localStorage.setItem('okta-cache-storage', JSON.stringify({
          'https://auth-js-test.okta.com/.well-known/openid-configuration': {
            expiresAt: 1449786329,
            response: wellKnown.response
          }
        }));
        return oauthUtil.getWellKnown(test.oa);
      },
      expectations: function() {
        var cache = localStorage.getItem('okta-cache-storage');
        expect(cache).toEqual(JSON.stringify({
          'https://auth-js-test.okta.com/.well-known/openid-configuration': {
            expiresAt: 1449786329,
            response: wellKnown.response
          }
        }));
      }
    });
    util.itMakesCorrectRequestResponse({
      title: 'doesn\'t use cached response if past cache expiration',
      setup: {
        calls: [
          {
            request: {
              method: 'get',
              uri: '/.well-known/openid-configuration'
            },
            response: 'well-known'
          }
        ],
        time: 1450000000
      },
      execute: function(test) {
        localStorage.setItem('okta-cache-storage', JSON.stringify({
          'https://auth-js-test.okta.com/.well-known/openid-configuration': {
            expiresAt: 1449786329,
            response: wellKnown.response
          }
        }));
        return oauthUtil.getWellKnown(test.oa);
      },
      expectations: function() {
        var cache = localStorage.getItem('okta-cache-storage');
        expect(cache).toEqual(JSON.stringify({
          'https://auth-js-test.okta.com/.well-known/openid-configuration': {
            expiresAt: 1450086400,
            response: wellKnown.response
          }
        }));
      }
    });
  });

  describe('getOAuthUrls', function() {
    function setupOAuthUrls(options) {
      var sdk = new OktaAuth(options.oktaAuthArgs || {
        url: 'https://auth-js-test.okta.com'
      });

      var oauthParams = options.oauthParams || {
        responseType: 'id_token'
      };

      var result, error;
      try {
        result = oauthUtil.getOAuthUrls(sdk, oauthParams, options.options);
      } catch(e) {
        error = e;
      }

      if (options.expectedResult) {
        expect(result).toEqual(options.expectedResult);
      }

      if (options.expectedError) {
        expect(error.name).toEqual(options.expectedError.name);
        expect(error.message).toEqual(options.expectedError.message);
        expect(error.errorCode).toEqual('INTERNAL');
        expect(error.errorSummary).toEqual(options.expectedError.message);
        expect(error.errorLink).toEqual('INTERNAL');
        expect(error.errorId).toEqual('INTERNAL');
        expect(error.errorCauses).toEqual([]);
      }
    }
    
    it('defaults all urls using global defaults', function() {
      setupOAuthUrls({
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        }
      });
    });
    it('sanitizes forward slashes', function() {
      setupOAuthUrls({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          issuer: 'https://auth-js-test.okta.com/',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize/',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo/'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        }
      });
    });
    it('overrides defaults with options', function() {
      setupOAuthUrls({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          issuer: 'https://bad.okta.com',
          authorizeUrl: 'https://bad.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://bad.okta.com/oauth2/v1/userinfo'
        },
        options: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        }
      });
    });
    it('sanitizes options with forward slashes', function() {
      setupOAuthUrls({
        options: {
          issuer: 'https://auth-js-test.okta.com/',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize/',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo/'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        }
      });
    });
    it('uses issuer to generate authorizeUrl and userinfoUrl', function() {
      setupOAuthUrls({
        options: {
          issuer: 'https://auth-js-test.okta.com'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/v1/userinfo'
        }
      });
    });
    it('uses authServer issuer to generate authorizeUrl and userinfoUrl', function() {
      setupOAuthUrls({
        options: {
          issuer: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/userinfo'
        }
      });
    });
    it('uses authServer issuer as authServerId to generate authorizeUrl and userinfoUrl', function() {
      setupOAuthUrls({
        options: {
          issuer: 'aus8aus76q8iphupD0h7'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7',
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/userinfo'
        }
      });
    });
    it('allows token requested with only authorizeUrl and userinfoUrl', function() {
      setupOAuthUrls({
        oauthParams: {
          responseType: 'token'
        },
        options: {
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/userinfo'
        },
        expectedResult: {
          issuer: 'https://auth-js-test.okta.com', // We don't validate the issuer of access tokens, so this is ignored
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize',
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/userinfo'
        }
      });
    });
    it('fails if id_token requested without issuer, with authorizeUrl', function() {
      setupOAuthUrls({
        oauthParams: {
          responseType: 'id_token'
        },
        options: {
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize'
        },
        expectedError: {
          name: 'AuthSdkError',
          message: 'Cannot request idToken with an authorizeUrl without an issuer'
        }
      });
    });
    it('fails if token requested without issuer, without userinfoUrl, with authorizeUrl', function() {
      setupOAuthUrls({
        oauthParams: {
          responseType: 'token'
        },
        options: {
          authorizeUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/authorize'
        },
        expectedError: {
          name: 'AuthSdkError',
          message: 'Cannot request accessToken with an authorizeUrl without an issuer or userinfoUrl'
        }
      });
    });
    it('fails if token requested without issuer, without authorizeUrl, with userinfoUrl', function() {
      setupOAuthUrls({
        oauthParams: {
          responseType: 'id_token'
        },
        options: {
          userinfoUrl: 'https://auth-js-test.okta.com/oauth2/aus8aus76q8iphupD0h7/v1/userinfo'
        },
        expectedError: {
          name: 'AuthSdkError',
          message: 'Cannot request token with an userinfoUrl without an issuer or authorizeUrl'
        }
      });
    });
  });
});
