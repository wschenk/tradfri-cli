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
  let sceneName = argv[3]

  const room = scenes.findRoom( tradfri, roomName );

  if( room == null ) {
    console.log( "Unable to find room named", roomName);
    process.exit(1);
  }

  let scene = null;

  sceneName = sceneName.toLowerCase();
  // Look for the scene
  for (const sceneId in room.scenes ) {
    if( room.scenes[sceneId].name.toLowerCase() === sceneName ) {
      scene = room.scenes[sceneId]
    }
  }

  if( scene == null ) {
    console.log( "Unable to find scene named", sceneName )
    process.exit(1);
  }

  room.group.client = tradfri;
  scenes.printRoomInfo( tradfri, room )

  console.log( "Switching", room.group.name, "to scene", scene.name )
  room.group.activateScene(scene.instanceId);

  scenes.printRoomInfo( tradfri, room )

  // Give the messages a chance to propogate
  await delay(1000);
  await tradfri.destroy();
  process.exit(0);
})()
