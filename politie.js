/*
Name:		politie.js - Unofficial module for Politie.nl resources
Source:		https://github.com/fvdm/nodejs-politie
Feedsback:	https://github.com/fvdm/nodejs-politie/issues
License:	Unlicense / Public Domain

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
*/

var http = require('http'),
    querystring = require('querystring'),
    app = { vermist: {}, gezocht: {} }


app.talk = function( path, props, callback ) {
	if( typeof props === 'function' ) {
		var callback = props
		var props = {}
	}
	
	if( typeof props !== 'object' ) {
		props = {}
	}
	
	path += '?'+ querystring.stringify( props )
	
	var options = {
		host:		'www.politie.nl',
		port:		80,
		path:		path,
		method:		'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17'
		}
	}
	
	var request = http.request( options )
	
	request.on( 'response', function( response ) {
		var data = ''
		response.on( 'data', function( ch ) { data += ch })
		response.on( 'close', function() { callback( new Error('connection dropped') ) })
		response.on( 'end', function() {
			callback( null, data )
		})
	})
	
	request.on( 'error', function( error ) {
		var err = new Error('request failed')
		err.request = options
		err.details = error
		callback( err )
	})
	
	request.end()
}

module.exports = app
