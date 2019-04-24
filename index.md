---
title: Controlling IKEA Tradfri devices from your computer
subtitle: IKEA is cheap and everywhere
tags:
  - howto
  - zigbee
  - IKEA
  - node
date: "2019-04-24"
repository: https://github.com/wschenk/tradfri-cli
remote: git@github.com:wschenk/tradfri-cli.git
---

I stumbled upon a [fun blogpost about the Dumbass Home](https://vas3k.com/blog/dumbass_home/?ref=sn) and it turned me onto the IKEA Trådfri line of products.  So I got a couple, and figured out how to control them from my laptop (or say a Raspberry PI) from node.  Here's how to do it.

<!--more-->

## Overview

1. Go to IKEA and buy stuff
2. Setup IKEA Trådfri Gateway and Lights as normal
3. Install the `node-tradfri-client` library
4. Copy the below scripts

First, set up a switch, lightbulb, and a gateway.  The gateway needs to be plugged into the router which is a bit of a pain.  You need at least one controller connected to a device to get the gateway to recognize things; once you have that it should be fairly straightforward.  When in doubt, move closer to the gateway.

## Example code

We are going to use the [node-tradfri-client library](https://github.com/AlCalzone/node-tradfri-client), the delay library, and the conf node library to store values after the fun.

```bash
mkdir ikeatest
cd ikeatest
npm init
yarn add node-tradfri-client delay conf
```

## Find the Gateway

[`gateway.js`](gateway.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/gateway.js" language="js" %}}

## Getting a security token

Look at the back of your gateway to get the security token.  We will use this to get an
access token to the gateway, which we will then use to communicate with the device.
Set the `IKEASECURITY` token in the environment and then run this script:

```bash
$ export IKEASECURITY=akakakak
```

[`connection.js`](connection.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/connection.js" language="js" %}}

## Printing out discovered device info

Calling the `observeDevices()` method will make the client start listening for devices that the gateway is connected to.  The library itself keeps track of what it knows inside of the `tradfri.devices` hash, so we'll pause for a bit to give it time to listen and then print out what it found.

[`devices.js`](devices.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/devices.js" language="js" %}}

## Registering our own device listeners

We can register a listener callback to watch for when thing change, keeping our program running forever watching for the lights to go on and off!

[`device_watcher.js`](device_watcher.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/device_watcher.js" language="js" %}}

## Switching and dimming

Now that we have code that can react to changes, lets write some code that controls things!

[`device_changer.js`](device_changer.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/device_changer.js" language="js" %}}

This lets you add multiple commands on the line, so if we wanted to make a few changes at once you could do something like this:

```bash
node device_changer.js 65538 --on --color efd275 65543 --brightness 50 --on 65540 --on
```

## Scenes and Rooms

The library also has methods to deal with scenes and rooms all at once.  Let's take a look at a room watcher:

[`scenes.js`](scenes.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/scenes.js" language="js" %}}

## Setting the scene

Lets write another small utility to be able to change a room to a preset setting!

[`scene_changer.js`](scene_changer.js):

{{% code file="articles/2019/controlling_ikea_tradfri_with_node/scene_changer.js" language="js" %}}

## Other stuff

You can also update the settings of the devices in the controller, which we aren't going to cover.  You can also add additional scenes and update them.  These are documented further in the fantastic library.

Have fun playing around!

---

References:

1. https://learn.pimoroni.com/tutorial/sandyj/controlling-ikea-tradfri-lights-from-your-pi
2. https://github.com/AlCalzone/node-tradfri-client
