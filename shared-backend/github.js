'use strict';

const config         = require('config');
const github         = require('octonode');
const {stringify}    = require('querystring');
const {wrap}         = require('co');
const rp             = require('request-promise');
const {promisifyAll} = require('bluebird');

const CLIENT_ID = config.get('github.clientID');
const CLIENT_SECRET = config.get('github.clientSecret');
const CALLBACK_URL = config.get('github.callbackURL');

promisifyAll(Object.getPrototypeOf(github.client()), {multiArgs: true});

github.auth.config({
  id: CLIENT_ID,
  secret: CLIENT_SECRET,
});

function createLoginUrl() {
  const queryStr = stringify({
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    state: Date.now(),
  });
  return `https://github.com/login/oauth/authorize?${queryStr}`;
}

const handleLoginCallback = wrap(function *({code, state}) {
  const {access_token} = yield rp({
    method: 'POST',
    uri: 'https://github.com/login/oauth/access_token',
    body: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: CALLBACK_URL,
      code,
      state,
    },
    json: true,
  });

  return access_token;
});

module.exports = {
  github,
  createLoginUrl,
  handleLoginCallback,
};
