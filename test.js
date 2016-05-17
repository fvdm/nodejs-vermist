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
    var location = data && data.location;
    var center = location && location.center;
    var markers = location && location.markers;
    var marker = markers && markers[0];

    test (err)
      .isObject ('fail', 'data', data)
      .isObject ('fail', 'data.article', article)
      .isObject ('fail', 'data.article.image', article && article.image)
      .isObject ('fail', 'data.article.link', article && article.link)
      .isString ('fail', 'data.article.title', article && article.title)
      .isNotEmpty ('warn', 'data.article.title', article && article.title)
      .isString ('fail', 'data.article.language', article && article.language)
      .isNotEmpty ('warn', 'data.article.language', article && article.language)
      .isString ('fail', 'data.article.caseNumber', article && article.caseNumber)
      .isRegexpMatch ('warn', 'data.article.caseNumber', article && article.caseNumber, /^\d+$/)
      .isString ('fail', 'data.article.pretext', article && article.pretext)
      .isObject ('fail', 'data.location', location)
      .isObject ('fail', 'data.location.center', center)
      .isString ('fail', 'data.location.center.latitude', center && center.latitude)
      .isNotEmpty ('warn', 'data.location.center.latitude', center && center.latitude)
      .isString ('fail', 'data.location.center.longitude', center && center.longitude)
      .isNotEmpty ('warn', 'data.location.center.longitude', center && center.longitude)
      .isArray ('fail', 'data.location.markers', markers)
      .isObject ('fail', 'data.location.markers[0]', marker)
      .isString ('fail', 'data.location.markers[0].latitude', marker && marker.latitude)
      .isNotEmpty ('warn', 'data.location.markers[0].latitude', marker && marker.latitude)
      .isString ('fail', 'data.location.markers[0].longitude', marker && marker.longitude)
      .isNotEmpty ('warn', 'data.location.markers[0].longitude', marker && marker.longitude)
      .isString ('fail', 'data.location.image', location && location.image)
      .isNotEmpty ('warn', 'data.location.image', location && location.image)
      .done ();
  });
});


dotest.run ();
