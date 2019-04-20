const tradfri = require( 'node-tradfri-client' )

tradfri.discoverGateway().then( result => console.log( result ) )
