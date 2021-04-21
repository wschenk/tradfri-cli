import tradfri from "node-tradfri-client";

tradfri.discoverGateway().then((result: tradfri.DiscoveredGateway | null) => console.log(result));
