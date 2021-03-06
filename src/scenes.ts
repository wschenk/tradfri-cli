import delay from "delay";
import { Group, GroupInfo, Scene, TradfriClient } from "node-tradfri-client";
import { getConnection } from "./connection";
import { printDeviceInfo } from "./devices";

function printRoomInfo( tradfri: TradfriClient, room: GroupInfo ): void {
  const group: Group = room.group;
  const scenes: Record<string, Scene> = room.scenes;

  console.log( "ROOM", group.instanceId, group.name);
  console.log( "DEVICES");
  for(const deviceId of group.deviceIDs) {
    printDeviceInfo( tradfri.devices[deviceId] );
  }
  console.log( "SCENES" );
  for (const sceneId in scenes ) {
    const scene = scenes[sceneId];
    console.log( sceneId, scene.name ); // , scene.lightSettings )
  }

  console.log( "----\n");

}

function findRoom( tradfri: TradfriClient, name: string ): GroupInfo | null {
  const lowerName = name.toLowerCase();

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

export {printRoomInfo, findRoom};

// Only run this method if invoked with "node devices.js"
if( __filename === process.argv[1] ) {
  (async () => {
    const tradfri = await getConnection();

    tradfri.observeDevices();
    tradfri.observeGroupsAndScenes();

    // Wait a second hopefully something will be loaded by then!
    await delay(1500);

    for (const groupId in tradfri.groups ) {
      const collection = tradfri.groups[groupId];
      printRoomInfo( tradfri, collection );
    }

    tradfri.destroy();
    process.exit(0);
  })();
}
