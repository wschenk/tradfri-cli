import { Accessory } from "node-tradfri-client";
import { getConnection } from "./connection";
import { printDeviceInfo } from "./devices";

function deviceUpdated(device: Accessory): void {
  printDeviceInfo(device);
}

function deviceRemoved(deviceId: string): void {
  console.log("See you later", deviceId, "it's been great.");
}

(async () => {
  const tradfri = await getConnection();
  tradfri
    .on("device updated", deviceUpdated)
    .on("device removed", deviceRemoved)
    .observeDevices();
})();
