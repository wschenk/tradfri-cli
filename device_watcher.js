const connection = require( './connection' );
const devices    = require( './devices' );

function deviceUpdated( device ) {
  devices.printDeviceInfo( device );
}

function deviceRemoved( deviceId ) {
  console.log( "See you later", deviceId, "it's been great.")
}

(async () => {
  const tradfri = await connection.getConnection();

  tradfri
    .on("device updated", deviceUpdated)
    .on("device removed", deviceRemoved)
    .observeDevices();
})()
