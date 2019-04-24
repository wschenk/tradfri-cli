const connection = require( './connection' );
const delay      = require( 'delay' );
const devices    = require( './devices')

function printRoomInfo( tradfri, room ) {
  const group = room.group
  const scenes = room.scenes
  console.log( "ROOM", group.instanceId, room.name, "Current Scene:", scenes[group.sceneId].name )
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

function findRoom( tradfri, name ) {
  let lowerName = name.toLowerCase();

  // Look for the group
  for (const groupId in tradfri.groups ) {
    if( tradfri.groups[groupId].group.name.toLowerCase() === lowerName ) {
      return tradfri.groups[groupId];
    }

    if( groupId === name ) {
      return tradfri.groups[groupId];
    }
  }

  return null;
}

module.exports = {printRoomInfo, findRoom};

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
      printRoomInfo( tradfri, collection )
    }

    tradfri.destroy()
    process.exit(0);
  })()
}
