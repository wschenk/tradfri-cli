const Conf              = require('conf');
const delay             = require('delay');
const NodeTradfriClient = require("node-tradfri-client");
const path              = require( 'path' );

const conf = new Conf();
const { discoverGateway, TradfriClient } = NodeTradfriClient;

async function getConnection() {
  console.log( "Looking up IKEA Tradfri gateway on your network" )
  let gateway = await discoverGateway()

  if( gateway == null ) {
    console.log( "No Tradfri gateway found in local network" );
    process.exit(1);
  }

  console.log( "Connecting to", gateway.host)
  const tradfri = new TradfriClient(gateway.host)

  if( !conf.has( 'security.identity' ) || !conf.has('security.psk' ) ) {
    let securityCode = process.env.IKEASECURITY
    if( securityCode === "" || securityCode === undefined ) {
      console.log( "Please set the IKEASECURITY env variable to the code on the back of the gateway")
      process.exit(1)
    }

    console.log( "Getting identity from security code" )
    const {identity, psk} = await tradfri.authenticate(securityCode);

    conf.set( 'security', {identity,psk} )
  }

  console.log( "Securely connecting to gateway" )

  await tradfri.connect(conf.get( 'security.identity' ), conf.get( 'security.psk' ))

  return tradfri;
}

module.exports = {getConnection: getConnection};

// Only run this method if invoked with "node connection.js"
if( __filename === process.argv[1] ) {
  (async () => {
    const tradfri = await getConnection();
    console.log( "Connection complete" )

    console.log( "Waiting 1 second")
    await delay( 1000 )

    console.log( "Closing connection")
    tradfri.destroy()
    process.exit(0);
  })()
}
