/* eslint-disable complexity, max-statements */
define(function(require) {
  var oauthUtil = require('../util/oauthUtil');
  var tokens = require('../util/tokens');

  describe('OAuth Methods', function () {

    describe('idToken.refresh', function () {
      it('returns new id_token using old id_token', function (done) {
        return oauthUtil.setupFrame({
          oktaAuthArgs: {
            url: 'https://auth-js-test.okta.com',
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://example.com/redirect'
          },
          refreshArgs: {},
          postMessageSrc: {
            baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
            queryParams: {
              'client_id': 'NPSfOkH5eZrTy8PMDlvx',
              'redirect_uri': 'https://example.com/redirect',
              'response_type': 'id_token',
              'response_mode': 'okta_post_message',
              'state': oauthUtil.mockedState,
              'nonce': oauthUtil.mockedNonce,
              'scope': 'openid email',
              'prompt': 'none'
            }
          }
        })
        .fin(function() {
          done();
        });
      });
    });

    describe('idToken.authorize', function () {

      it('returns id_token using sessionToken', function (done) {
        return oauthUtil.setupFrame({
          authorizeArgs: {
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://example.com/redirect',
            sessionToken: 'testSessionToken'
          },
          postMessageSrc: {
            baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
            queryParams: {
              'client_id': 'NPSfOkH5eZrTy8PMDlvx',
              'redirect_uri': 'https://example.com/redirect',
              'response_type': 'id_token',
              'response_mode': 'okta_post_message',
              'state': oauthUtil.mockedState,
              'nonce': oauthUtil.mockedNonce,
              'scope': 'openid email',
              'prompt': 'none',
              'sessionToken': 'testSessionToken'
            }
          }
        })
        .fin(function() {
          done();
        });
      });

      it('returns id_token using idp', function (done) {
        return oauthUtil.setupPopup({
          authorizeArgs: {
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://example.com/redirect',
            idp: 'testIdp'
          },
          postMessageSrc: {
            baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
            queryParams: {
              'client_id': 'NPSfOkH5eZrTy8PMDlvx',
              'redirect_uri': 'https://example.com/redirect',
              'response_type': 'id_token',
              'response_mode': 'okta_post_message',
              'display': 'popup',
              'state': oauthUtil.mockedState,
              'nonce': oauthUtil.mockedNonce,
              'scope': 'openid email',
              'idp': 'testIdp'
            }
          }
        })
        .fin(function() {
          done();
        });
      });

      it('returns id_token using iframe', function (done) {
        return oauthUtil.setupFrame({
          authorizeArgs: {
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://example.com/redirect',
            sessionToken: 'testToken'
          }
        })
        .fin(function() {
          done();
        });
      });

      it('returns id_token using popup fragment', function (done) {
        return oauthUtil.setupPopup({
          hrefMock: 'https://auth-js-test.okta.com',
          changeToHash: '#id_token=' + tokens.standardIdToken + '&state=' + oauthUtil.mockedState,
          authorizeArgs: {
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://auth-js-test.okta.com/redirect',
            idp: 'testIdp',
            responseMode: 'fragment'
          },
          postMessageSrc: {
            baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
            queryParams: {
              'client_id': 'NPSfOkH5eZrTy8PMDlvx',
              'redirect_uri': 'https://auth-js-test.okta.com/redirect',
              'response_type': 'id_token',
              'response_mode': 'fragment',
              'display': 'popup',
              'state': oauthUtil.mockedState,
              'nonce': oauthUtil.mockedNonce,
              'scope': 'openid email',
              'idp': 'testIdp'
            }
          }
        })
        .fin(function() {
          done();
        });
      });

      it('doesn\'t throw an error when redirectUri and clientId are passed via OktaAuth', function (done) {
        return oauthUtil.setupFrame({
          oktaAuthArgs: {
            url: 'https://auth-js-test.okta.com',
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://example.com/redirect'
          },
          authorizeArgs: {
            sessionToken: 'testToken'
          }
        })
        .fin(function() {
          done();
        });
      });

      describe('scope', function () {
        it('includes default scope in the uri', function (done) {
          return oauthUtil.setupFrame({
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            },
            postMessageSrc: {
              baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
              queryParams: {
                'client_id': 'NPSfOkH5eZrTy8PMDlvx',
                'redirect_uri': 'https://example.com/redirect',
                'response_type': 'id_token',
                'response_mode': 'okta_post_message',
                'state': oauthUtil.mockedState,
                'nonce': oauthUtil.mockedNonce,
                'scope': 'openid email',
                'prompt': 'none',
                'sessionToken': 'testToken'
              }
            }
          })
          .fin(done);
        });
        it('includes specified scope in the uri', function (done) {
          return oauthUtil.setupFrame({
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              scopes: ['openid', 'testscope'],
              sessionToken: 'testToken'
            },
            postMessageSrc: {
              baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
              queryParams: {
                'client_id': 'NPSfOkH5eZrTy8PMDlvx',
                'redirect_uri': 'https://example.com/redirect',
                'response_type': 'id_token',
                'response_mode': 'okta_post_message',
                'state': oauthUtil.mockedState,
                'nonce': oauthUtil.mockedNonce,
                'scope': 'openid testscope',
                'prompt': 'none',
                'sessionToken': 'testToken'
              }
            },
            expectedResp: {
              idToken: tokens.standardIdToken,
              claims: tokens.standardIdTokenClaims,
              expiresAt: 1449699930,
              scopes: ['openid', 'testscope']
            }
          })
          .fin(done);
        });

        it('uses the current href as the redirect_uri when it\'s not provided', function (done) {
          return oauthUtil.setupFrame({
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              sessionToken: 'testToken'
            },
            postMessageSrc: {
              baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
              queryParams: {
                'client_id': 'NPSfOkH5eZrTy8PMDlvx',
                'redirect_uri': window.location.href,
                'response_type': 'id_token',
                'response_mode': 'okta_post_message',
                'state': oauthUtil.mockedState,
                'nonce': oauthUtil.mockedNonce,
                'scope': 'openid email',
                'prompt': 'none',
                'sessionToken': 'testToken'
              }
            }
          })
          .fin(done);
        });
      });

      describe('errors', function() {
        oauthUtil.itpErrorsCorrectly('throws an error when openid scope isn\'t specified',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              scopes: ['notopenid'],
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'openid scope must be specified in the scopes argument when requesting an id_token',
            errorCode: 'INTERNAL',
            errorSummary: 'openid scope must be specified in the scopes argument when requesting an id_token',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an error when clientId isn\'t specified',
          {
            authorizeArgs: {
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'A clientId must be specified in the OktaAuth constructor to get a token',
            errorCode: 'INTERNAL',
            errorSummary: 'A clientId must be specified in the OktaAuth constructor to get a token',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an oauth error on issue',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            },
            postMessageResp: {
              error: 'sampleErrorCode',
              'error_description': 'something went wrong',
              state: oauthUtil.mockedState
            }
          },
          {
            name: 'OAuthError',
            message: 'something went wrong',
            errorCode: 'sampleErrorCode',
            errorSummary: 'something went wrong'
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an oauth error on issue with a fragment response',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://auth-js-test.okta.com/redirect',
              idp: 'testIdp',
              responseMode: 'fragment'
            },
            hrefMock: 'https://auth-js-test.okta.com',
            changeToHash: '#error=invalid_scope&error_description=' +
              'The+requested+scope+is+invalid%2C+unknown%2C+or+malformed.'
          },
          {
            name: 'OAuthError',
            message: 'The requested scope is invalid, unknown, or malformed.',
            errorCode: 'invalid_scope',
            errorSummary: 'The requested scope is invalid, unknown, or malformed.'
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an error when window is closed manually with a fragment',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://auth-js-test.okta.com/redirect',
              idp: 'testIdp',
              responseMode: 'fragment'
            },
            hrefMock: 'https://auth-js-test.okta.com',
            closePopup: true
          },
          {
            name: 'AuthSdkError',
            message: 'Unable to parse OAuth flow response',
            errorCode: 'INTERNAL',
            errorSummary: 'Unable to parse OAuth flow response',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an error when window is closed manually with a postMessage',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              idp: 'testIdp'
            },
            closePopup: true
          },
          {
            name: 'AuthSdkError',
            message: 'Unable to parse OAuth flow response',
            errorCode: 'INTERNAL',
            errorSummary: 'Unable to parse OAuth flow response',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
      });

      describe('validation', function() {
        oauthUtil.itpErrorsCorrectly('throws an sdk error when state doesn\'t match',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://auth-js-test.okta.com/redirect',
              idp: 'testIdp',
              responseMode: 'fragment'
            },
            hrefMock: 'https://auth-js-test.okta.com',
            changeToHash: '#id_token=' + tokens.standardIdToken + '&state=mismatchedState'
          },
          {
            name: 'AuthSdkError',
            message: 'OAuth flow response state doesn\'t match request state',
            errorCode: 'INTERNAL',
            errorSummary: 'OAuth flow response state doesn\'t match request state',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an sdk error when nonce doesn\'t match',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken',
              nonce: 'mismatchedNonce'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'OAuth flow response nonce doesn\'t match request nonce',
            errorCode: 'INTERNAL',
            errorSummary: 'OAuth flow response nonce doesn\'t match request nonce',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an sdk error when issuer doesn\'t match',
          {
            oktaAuthArgs: {
              url: 'https://different.issuer.com',
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect'
            },
            authorizeArgs: {
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The issuer [https://auth-js-test.okta.com] does not match [https://different.issuer.com]',
            errorCode: 'INTERNAL',
            errorSummary: 'The issuer [https://auth-js-test.okta.com] does not match [https://different.issuer.com]',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an sdk error when audience doesn\'t match',
          {
            authorizeArgs: {
              clientId: 'differentAudience',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The audience [NPSfOkH5eZrTy8PMDlvx] does not match [differentAudience]',
            errorCode: 'INTERNAL',
            errorSummary: 'The audience [NPSfOkH5eZrTy8PMDlvx] does not match [differentAudience]',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an sdk error when token expired before it was issued',
          {
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            },
            postMessageResp: {
              'id_token': tokens.expiredBeforeIssuedIdToken,
              state: oauthUtil.mockedState
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The JWT expired before it was issued',
            errorCode: 'INTERNAL',
            errorSummary: 'The JWT expired before it was issued',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        oauthUtil.itpErrorsCorrectly('throws an sdk error when token is expired',
          {
            time: 9999999999,
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The JWT expired and is no longer valid',
            errorCode: 'INTERNAL',
            errorSummary: 'The JWT expired and is no longer valid',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        it('doesn\'t throw an error when expired if within acceptable clock skew', function(done) {
          return oauthUtil.setupFrame({
            time: tokens.standardIdTokenClaims.exp + 499,
            oktaAuthArgs: {
              url: 'https://auth-js-test.okta.com',
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              maxClockSkew: 500
            },
            authorizeArgs: {
              sessionToken: 'testToken'
            }
          })
          .fin(done);
        });
        oauthUtil.itpErrorsCorrectly('throws an sdk error when token is issued in the future',
          {
            time: 0,
            authorizeArgs: {
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The JWT was issued in the future',
            errorCode: 'INTERNAL',
            errorSummary: 'The JWT was issued in the future',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
        it('doesn\'t throw an error when issued in future if within acceptable clock skew', function(done) {
          return oauthUtil.setupFrame({
            time: tokens.standardIdTokenClaims.iat - 499,
            oktaAuthArgs: {
              url: 'https://auth-js-test.okta.com',
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              maxClockSkew: 500
            },
            authorizeArgs: {
              sessionToken: 'testToken'
            }
          })
          .fin(done);
        });
        it('uses a default clock skew', function(done) {
          return oauthUtil.setupFrame({
            time: tokens.standardIdTokenClaims.exp + 299,
            oktaAuthArgs: {
              url: 'https://auth-js-test.okta.com',
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect'
            },
            authorizeArgs: {
              sessionToken: 'testToken'
            }
          })
          .fin(done);
        });
        oauthUtil.itpErrorsCorrectly('accepts 0 as a clock skew',
          {
            time: tokens.standardIdTokenClaims.exp + 1,
            oktaAuthArgs: {
              url: 'https://auth-js-test.okta.com',
              clientId: 'NPSfOkH5eZrTy8PMDlvx',
              redirectUri: 'https://example.com/redirect',
              maxClockSkew: 0
            },
            authorizeArgs: {
              sessionToken: 'testToken'
            }
          },
          {
            name: 'AuthSdkError',
            message: 'The JWT expired and is no longer valid',
            errorCode: 'INTERNAL',
            errorSummary: 'The JWT expired and is no longer valid',
            errorLink: 'INTERNAL',
            errorId: 'INTERNAL',
            errorCauses: []
          }
        );
      });
    });
  });
});
