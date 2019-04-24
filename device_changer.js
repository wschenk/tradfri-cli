const connection = require( './connection' );
const devices    = require( './devices' );
const delay      = require( 'delay' );

(async () => {
  let argv = process.argv;

  if( argv.length <= 2 ) {
    console.log( "Usage:" )
    console.log( "node device_changer.js", "deviceId", "--on")
    console.log( "node device_changer.js", "deviceId", "--off")
    console.log( "node device_changer.js", "deviceId", "--toggle")
    console.log( "node device_changer.js", "deviceId", "--color hexcolor")
    console.log( "node device_changer.js", "deviceId", "--brightness 0-100")

    process.exit(1)
  }

  const tradfri = await connection.getConnection();
  tradfri.observeDevices();
  await delay( 1000 )

  let position = 2;
  let currentDevice = null;
  let accessory = null;
  while( position < argv.length ) {
    switch( argv[position] ) {
      case '--on':
        console.log( "Turning", currentDevice.instanceId, "on")
        accessory.turnOn()
        break;
      case '--off':
        console.log( "Turning", currentDevice.instanceId, "off")
        accessory.turnOff();
        break;
      case '--toggle':
        accessory.toggle();
        console.log( "toggle device", currentDevice.instanceId )
        break;
      case '--color':
        position++;
        console.log( "Setting color of", currentDevice.instanceId, "to", argv[position])
        accessory.setColor(argv[position])
        break;
      case '--brightness':
        position++;
        console.log( "Setting brightness of", currentDevice.instanceId, "to", argv[position])
        accessory.setBrightness( argv[position] )
        break;
      default:
        currentDevice = devices.findDevice( tradfri, argv[position] )
        if( currentDevice == null ) {
          console.log( "Unable to find device", argv[position] )
          console.log( tradfri.devices )
          process.exit(1)
        }
        switch( currentDevice.type ) {
          case 0:
          case 4:
            console.log( "Can't control this type of device" )
            process.exit(1);
            break;
          case 2: //light
            accessory = currentDevice.lightList[0]
            accessory.client = tradfri
            break;
          case 3: // plug
            accessory = currentDevice.plugList[0]
            accessory.client = tradfri
            break;
        }
        break;
    }

    position ++;
  }

  await delay(1000);
  await tradfri.destroy();
  process.exit(0);
})()
