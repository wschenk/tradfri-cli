const connection = require( './connection' );
const devices    = require( './devices' );
const scenes     = require( './scenes');
const delay      = require( 'delay' );

(async () => {
  let argv = process.argv;

  if( argv.length != 4 ) {
    console.log( "Usage:" )
    console.log( "node scene_changer.js", "room", "scene")

    process.exit(1)
  }

  const tradfri = await connection.getConnection();
  tradfri.observeDevices();
  tradfri.observeGroupsAndScenes();
  await delay( 1500 )

  const roomName = argv[2]
  const sceneName = argv[3]

  let collection = null;

  // Look for the group
  for (const groupId in tradfri.groups ) {
    if( tradfri.groups[groupId].group.name == roomName ) {
      collection = tradfri.groups[groupId]
    }
  }

  if( collection == null ) {
    console.log( "Unable to find room named", roomName)
    process.exit(1)
  }

  let scene = null;

  // Look for the scene
  for (const sceneId in collection.scenes ) {
    if( collection.scenes[sceneId].name == sceneName ) {
      scene = collection.scenes[sceneId]
    }
  }

  if( scene == null ) {
    console.log( "Unable to find scene named", sceneName )
  }

  collection.group.client = tradfri;
  scenes.printGroupInfo( tradfri, collection )
  console.log( "Switching", collection.group.name, "to scene", scene.name )
  collection.group.activateScene(scene.instanceId);
  scenes.printGroupInfo( tradfri, collection )

  // Give the messages a chance to propogate
  await delay(1000);
  await tradfri.destroy();
  process.exit(0);
})()
