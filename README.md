Check out https://willschenk.com/articles/2019/controlling_ikea_tradfri_with_node/ for more information.

## Basic usage:

Look at the back of your gateway and find the security code.  We use that for the initial challenge and then store the token in a configuration file.  So once you get that token you won't need to use the environment variable.

```bash
export IKEASECURITY=asdfadf
```


## Scripts:

1. `node devices.js` - Connects, prints devices it knows about, and quits
2. `node device_watcher.js` - Watches for changes as they happen, waits forever
3. `node device_changer.js "Bulb 1" --on --color efd275 "Bulb 2" --brightness 50 --on "Plug" --on` -- Makes changes to specific devices, add as many as you want to the list.
4. `node scenes.js` -- List out rooms and availabe scenes
5. `node scene_change.js "Room 1" relax` -- Switches room 1 to the `relax` scene
