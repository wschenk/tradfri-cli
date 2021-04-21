import key from "./key.json";
import Conf from "conf";
import delay from "delay";
import { DiscoveredGateway, discoverGateway, TradfriClient } from "node-tradfri-client";

const conf = new Conf();

async function getConnection(): Promise<TradfriClient> {
  console.log("Looking up IKEA Tradfri gateway on your network");
  const gateway: DiscoveredGateway | null = await discoverGateway();

  if(gateway === undefined || gateway === null) {
    console.log( "No Tradfri gateway found in local network" );
    process.exit(1);
  }

  console.log( "Connecting to", gateway.host);
  const tradfri = new TradfriClient(gateway.host as string);

  if( !conf.has( "security.identity" ) || !conf.has("security.psk" ) ) {
    const securityCode = key.secret;
    if( securityCode === "" || securityCode === undefined ) {
      console.log( "Please set the IKEASECURITY env variable to the code on the back of the gateway");
      process.exit(1);
    }

    console.log( "Getting identity from security code" );
    const {identity, psk} = await tradfri.authenticate(securityCode);

    conf.set("security", { identity, psk });
  }

  console.log("Securely connecting to gateway");
  await tradfri.connect(conf.get("security.identity") as string, conf.get("security.psk") as string);

  return tradfri;
}

export {getConnection};

// Only run this method if invoked with "node connection.js"
if( __filename === process.argv[1] ) {
  (async () => {
    const tradfri = await getConnection();
    console.log( "Connection complete" );

    console.log( "Waiting 1 second");
    await delay( 1000 );

    console.log( "Closing connection");
    tradfri.destroy();
    process.exit(0);
  })();
}
