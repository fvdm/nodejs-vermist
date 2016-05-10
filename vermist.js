/*
Name:         vermist
Description:  Node.js module to retrieve missing persons from Politie.nl
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-vermist
Feedsback:    https://github.com/fvdm/nodejs-vermist/issues
License:      Unlicense (public domain, see UNLICENSE file)
*/

var httpreq = require ('httpreq');

var config = {
  timeout: 5000
};


/**
 * Process httpreq response
 *
 * @callback callback
 * @param err {Error, null} - httpreq error
 * @param res {object} - httpreq response details
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processResponse (err, res, callback) {
  var data = res && res.body || null;
  var error = null;

  if (res.statusCode >= 300) {
    error = new Error('remote error');
    error.statusCode = res.statusCode;
    error.headers = res.headers;
    error.body = data;
  }

  if (res.statusCode === 404) {
    error.message = 'not found';
  }

  if (error) {
    callback (error);
    return;
  }

  callback (null, data);
}


/**
 * Communication
 *
 * @callback callback
 * @param path {string} - Request path after 'www.politie.nl/gezocht-en-vermist'
 * @param [params] {object} - Request parameters
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function talk (path, params, callback) {
  var options = {
    url: 'https://www.politie.nl' + path,
    parameters: params,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17'
    }
  };

  if (typeof params === 'function') {
    callback = params;
    options.parameters = null;
  }

  httpreq.doRequest (options, function (err, res) {
    processResponse (err, res, callback);
  });
}


/**
 * Process a person
 *
 * @callback callback
 * @param err {Error, null} - Error
 * @param [data] {object} - Response data
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processPerson (err, data, callback) {
  if (err) {
    callback (err);
    return;
  }

  callback (null, data);
}


/**
 * Process a category
 *
 * @callback callback
 * @param err {Error, null} - Error
 * @param [data] {object} - Response data
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processCategory (err, data, callback) {
  if (err) {
    callback (err);
    return;
  }

  callback (null, data);
}


/**
 * Process search result
 *
 * @callback callback
 * @param err {Error, null} - Error
 * @param [data] {object} - Response data
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processSearch (err, data, callback) {
  if (err) {
    callback (err);
    return;
  }

  callback (null, data);
}


/**
 * Method
 *
 * @callback callback
 * @param input {string} - URL to person or Category name
 * @param [params] {object} - Query parameters
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodGet (input, params, callback) {
  var path = '';
  var cats = [
    'gezochte-personen',
    'nationale-opsporingslijst',
    'eigenaar-gezocht',
    'vermiste-kinderen',
    'vermiste-volwassenen',
    'niet-geidentificeerde-personen'
  ];

  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  input = String (input);

  // Person URL
  if (input.match (/^https:\/\//)) {
    path = input.replace ('https://www.politie.nl', '');

    talk (path, function (err, data) {
      processPerson (err, data, callback);
    });

    return;
  }

  // Search
  if (input === 'search' && Object.keys (params).length) {
    path = '/zoek';

    talk (path, params, function (err, data) {
      processSearch (err, data, callback);
    });

    return;
  }

  // Category name
  if (cats.indexOf (input) >= 0) {
    path = '/gezocht-en-vermist/' + input;
  }

  talk (path, function (err, data) {
    processCategory (err, data, callback);
  });
}


/**
 * Module interface
 *
 * @param [conf] {object}
 * @param [conf.timeout} {number} - Request time out in ms, 1000 = 1 sec
 * @returns methodGet {function}
 */

module.exports = function (conf) {
  config.timeout = conf.timeout || config.timeout;
  return methodGet;
};
