import { Accessory } from "node-tradfri-client";
import { getConnection } from "./connection";
import { printDeviceInfo } from "./devices";

function deviceUpdated(device: Accessory): void {
  printDeviceInfo(device);
}

function deviceRemoved(instanceId: number): void {
  console.log("See you later", instanceId, "it's been great.");
}

(async () => {
  const tradfri = await getConnection();
  tradfri
    .on("device updated", deviceUpdated)
    .on("device removed", deviceRemoved)
    .observeDevices();
})();
