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

De module is slechts één functie die op twee manier aangesproken kan worden.


### Lijst

```js
var vermist = require('vermist')

vermist( console.log )

// lijst categorie (kinderen, volwassenen, ongeidentificeerd)
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


### Persoon

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