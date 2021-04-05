import tradfri = require("node-tradfri-client");

tradfri.discoverGateway().then((result: tradfri.DiscoveredGateway | null) => console.log(result));
