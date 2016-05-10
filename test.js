/*
Name:         vermist - test.js
Description:  Node.js module to retrieve missing persons from Politie.nl
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-vermist
Feedsback:    https://github.com/fvdm/nodejs-vermist/issues
License:      Unlicense (public domain, see UNLICENSE file)
*/

var dotest = require ('dotest');
var app = require ('./');

var vermist = app ({
  timeout: process.env.testTimeout || null
});

var person = 'https://www.politie.nl/en/wanted-and-missing/unidentified-persons/2013%5B2%5D/oktober/unknown-man-13082203.html';


dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isFunction ('fail', 'interface', vermist)
    .done ();
});


dotest.add ('Method processPerson', function (test) {
  vermist (person, function (err, data) {
    var article = data && data.article;

    test (err)
      .isObject ('fail', 'data', data)
      .isObject ('fail', 'data.article', article)
      .isObject ('fail', 'data.article.image', article && article.image)
      .isObject ('fail', 'data.article.link', article && article.link)
      .isString ('fail', 'data.article.pretext', article && article.pretext)
      .isObject ('fail', 'data.location', data && data.location)
      .info (data);
  });
});


dotest.run ();
