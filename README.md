nodejs-vermist
==============

Zoek vermiste personen op Politie.nl


Installatie
-----------

Met [NPM](https://npmjs.org/) voor de actuele stabiele versie:

	npm install vermist


Of van Github voor de meeste recente code:

	git clone https://github.com/fvdm/nodejs-vermist
	npm install ./nodejs-vermist


Errors
------

De callback geeft twee parameters terug: `err` en `data`, waarbij err is `instanceof Error` in het geval van een fout of `null` als alles in orde is.

```js
function callback( err, data ) {
	if( !err ) {
		console.log( data )
	} else {
		console.log( err )
		console.log( err.stack )
	}
}
```


### Foutmeldingen

	Error: request failed        Er kan geen verbinding worden gemaakt.
	Error: connection dropped    De verbinding viel weg tijdens data ontvangst.
	Error: not found             De opgevraagde URL is niet gevonden.
	Error: service error         politie.nl geeft een fout.


Gebruik
-------

De module is slechts één functie die op twee manier aangesproken kan worden. De lijst is gesorteerd zoals het op de site staat.


## Lijst

### vermist ( categorie, [filter object], callback )

```js
var vermist = require('vermist')

// gecombineerde lijst
vermist( 'alles', console.log )

// lijst categorie (alles, kinderen, volwassenen, ongeidentificeerd)
vermist( 'kinderen', console.log )

// lijst zoeken
vermist( 'kinderen', {geoquery: 'utrecht', distance: 10}, console.log )
```

```js
[ { naam: 'Madina Gladies Ajonye',
    url: 'http://www.politie.nl/vermist/vermiste-kinderen/2009/december/11-madina-gladies-ajonye.html',
    thumbnail: 'http://www.politie.nl/binaries/w110h130/content/gallery/politie/vermist/vermiste-kinderen/2009/december/nlzo09090649c1.jpg',
    categorie: 'vermiste-kinderen',
    vermistJaar: '2009',
    vermistMaand: 'december',
    vermistDatum: '10-12-2009',
    vermistLocatie: 'Maartensdijk' } ]
```


#### Zoekfilters:

	page       : pagina nummer, één pagina heeft max 16 personen
	query      : zoekwoord
	geoquery   : locatie
	distance   : afstand rond locatie in KM, bijv. 10


## Persoon

### vermist ( url, callback )

```js
ver vermist = require('vermist')

vermist( 'http://www.politie.nl/vermist/vermiste-volwassenen/1974/december/02-franciscus-theijn.html', console.log )
```

```js
{ naam: 'Franciscus Theijn',
  updateDatum: '23-10-2012',
  updateTijd: '10:10',
  zaaknummer: '03050091',
  vermistDatum: '24-12-1974',
  vermistLocatie: 'Rotterdam',
  fotoGroot: 'http://www.politie.nl/binaries/content/gallery/politie/vermist/vermiste-volwassenen/1974/december/3050091p1.jpg',
  fotoKlein: 'http://www.politie.nl/binaries/w110h130/content/gallery/politie/vermist/vermiste-volwassenen/1974/december/3050091p1.jpg',
  omschrijving: [ 'Frans is op kerstavond 1974 vertrokken en niet meer teruggekeerd.' ],
  tipformulier: 'https://www.politie.nl/formulier/vermist/vermiste-volwassenen/1974/december/02-franciscus-theijn.html#tipformulier',
  voornaam: 'Franciscus',
  achternaam: 'Theijn',
  geboorteDatum: '19-01-1933',
  huidigeLeeftijd: '79',
  lengte: '175 cm',
  haarkleur: 'Grijs',
  oogkleur: 'Blauw',
  geslacht: 'Man' }
```


Unlicense
---------

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
