const connection = require( './connection' );
const delay      = require( 'delay' );
const devices    = require( './devices')

function printGroupInfo( tradfri, collection ) {
  const group = collection.group
  const scenes = collection.scenes
  console.log( "ROOM", group.instanceId, group.name, "Current Scene:", scenes[group.sceneId].name )
  console.log( "DEVICES")
  for( const deviceId of group.deviceIDs ) {
    devices.printDeviceInfo( tradfri.devices[deviceId] )
  }
  console.log( "SCENES" )
  for (const sceneId in scenes ) {
    const scene = scenes[sceneId]
    console.log( sceneId, scene.name ) // , scene.lightSettings )
  }

  console.log( "----\n")

}

module.exports = {printGroupInfo: printGroupInfo};

// Only run this method if invoked with "node devices.js"
if( __filename === process.argv[1] ) {
  (async () => {
    const tradfri = await connection.getConnection();

    tradfri.observeDevices();
    tradfri.observeGroupsAndScenes();

    // Wait a second hopefully something will be loaded by then!
    await delay( 1500 )

    for (const groupId in tradfri.groups ) {
      const collection = tradfri.groups[groupId];
      // console.log( device )
      printGroupInfo( tradfri, collection )
    }

    tradfri.destroy()
    process.exit(0);
  })()
}
