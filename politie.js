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
    querystring = require('querystring')


module.exports = function() {
	
	// Persoon informatie
	// app.vermist ( persoonURL, callback )
	
	if( arguments[0].match( /^http:\/\// ) ) {
		var callback = arguments[1]
		var path = arguments[0].replace( 'http://www.politie.nl/', '' )
		
		talk( path, function( err, data ) {
			if( !err ) {
				
				var persoon = {}
				
				data.replace( /<div class="contentDetail wanted">[\s\n]*<h1>Vermist<\/h1><h2>([^<]+)<\/h2>/, function( s, naam ) {
					persoon.naam = naam
				})
				
				data.replace( /<th>Laatste update:<\/th>[\s\n]*<td>([0-9]{2}\-[0-9]{2}\-[0-9]{4}) \| ([0-9]{2}:[0-9]{2})<\/td>/, function( s, datum, tijd ) {
					persoon.updateDatum = datum
					persoon.updateTijd = tijd
				})
				
				data.replace( /<th>Zaaknummer:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, zaak ) {
					persoon.zaaknummer = zaak
				})
				
				data.replace( /<th>Vermist sinds:<\/th><td>([0-9]{2}\-[0-9]{2}\-[0-9]{4})<\/td>/, function( s, datum ) {
					persoon.vermistDatum = datum
				})
				
				data.replace( /<th>Laatst gezien in:<\/th><td>([^<]+)<\/td>/, function( s, locatie ) {
					persoon.vermistLocatie = locatie
				})
				
				data.replace( /<a rel="group-media-gallery" class="gallery-fancybox" href="([^"]+)" title="[^"]+">/, function( s, foto ) {
					persoon.fotoGroot = 'http://www.politie.nl'+ foto
				})
				
				data.replace( /<img class="profile" src="([^"]+)" alt="[^"]*"\/>/, function( s, foto ) {
					persoon.fotoKlein = 'http://www.politie.nl'+ foto
				})
				
				data.replace( /<p>([^<]+)<\/p>/g, function( s, tekst ) {
					tekst = tekst.replace( /[\r\n]+/, ' ' )
					if( persoon.omschrijving === undefined ) {
						persoon.omschrijving = [tekst]
					} else {
						persoon.omschrijving.push( tekst )
					}
				})
				
				data.replace( /<a href="([^"]+)" class="continue">Naar het tipformulier<\/a>/, function( s, tip ) {
					persoon.tipformulier = tip
				})
				
				data.replace( /<th>Voornaam:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, voornaam ) {
					persoon.voornaam = voornaam
				})
				
				data.replace( /<th>Naam:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, naam ) {
					persoon.achternaam = naam
				})
				
				data.replace( /<th>Geboortedatum:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, geb ) {
					persoon.geboorteDatum = geb
				})
				
				data.replace( /<th>Huidige leeftijd:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, leeftijd ) {
					persoon.huidigeLeeftijd = leeftijd
				})
				
				data.replace( /<th>Lengte:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, lengte ) {
					persoon.lengte = lengte
				})
				
				data.replace( /<th>Haarkleur:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, haarkleur ) {
					persoon.haarkleur = haarkleur
				})
				
				data.replace( /<th>Oogkleur:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, oogkleur ) {
					persoon.oogkleur = oogkleur
				})
				
				data.replace( /<th>Geslacht:<\/th>[\s\n]*<td>([^<]+)<\/td>/, function( s, geslacht ) {
					persoon.geslacht = geslacht
				})
				
				callback( null, persoon )
				
			} else {
				callback( err )
			}
		})
		
	} else {
	
		// Personen lijst of zoeken
		// app.vermist ( categorie, [props], callback )
		
		// Eén $page bevat max 16 personen
		
		// CATEGORIE:
		//	alles
		//	kinderen
		//	volwassenen
		//	ongeidentificeerd
		
		// PROPS:
		//	page		: pagina nummer
		// 	query		: trefwoorden
		// 	geoquery	: locatie
		// 	distance	: afstand van `geoquery`  in KM, bijv. 2.0
		
		if( arguments.length == 2 ) {
			// lijst
			var categorie = arguments[0]
			var callback = arguments[1]
		} else if( arguments.length == 3 ) {
			// zoeken
			var categorie = arguments[0]
			var props = arguments[1]
			var callback = arguments[2]
		}
		
		switch( categorie ) {
			case 'kinderen':		var cat = '/vermiste-kinderen'; break
			case 'volwassenen':		var cat = '/vermiste-volwassenen'; break
			case 'ongeidentificeerd':	var cat = '/ongeidentificeerd'; break
			case 'alles': default:		var cat = ''; break
		}
		
		talk( 'vermist'+ cat, props, function( err, data ){
			if( !err ) {
				var personen = []
				
				data.replace( /<li class="profileBlock[^"]*">[\s\n]+<a href="(\/vermist\/([^\/]+)\/([0-9]{4})\/([a-z]+)\/[^\.]+\.html)" title="[^"]+">[\s\n]+<img class="profile" src="([^"]+)" alt="[^"]+"\/>[\s\n]+<span class="definition">([^<]+)<\/span>[\s\n]+Sinds: ([0-9]{2}\-[0-9]{2}\-[0-9]{4})<br\/>Laatst gezien in: ([^<]+)<\/a>[\s\n]+<\/li>/g, function( s, path, cat, jaar, maand, image, naam, sinds, locatie ) {
					personen.push({
						naam:		naam,
						url:		'http://www.politie.nl'+ path,
						thumbnail:	'http://www.politie.nl'+ image,
						categorie:	cat,
						vermistJaar:	jaar,
						vermistMaand:	maand,
						vermistDatum:	sinds,
						vermistLocatie:	locatie
					})
				})
				
				callback( null, personen )
			} else {
				callback( err )
			}
		})
	}
}

// Communicatie
function talk( path, props, callback ) {
	if( typeof props === 'function' ) {
		var callback = props
		var props = {}
	}
	
	if( typeof props !== 'object' ) {
		props = {}
	}
	
	path = '/'+ path +'?'+ querystring.stringify( props )
	
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
			data = data.toString('utf8').trim()
			
			if( response.statusCode == 404 ) {
				var err = new Error('not found')
				err.request = options
				err.response = {
					headers: response.headers,
					body: data
				}
				callback( err )
			} else if( response.statusCode >= 300 ) {
				var err = new Error('service error')
				err.request = options
				err.response = {
					headers: response.headers,
					body: data
				}
				callback( err )
			} else {
				callback( null, data )
			}
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
