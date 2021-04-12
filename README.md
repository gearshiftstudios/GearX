# The GearX Engine
A library to make the JS life more relaxing.
Thought of and programmed by **[Nikolas Karinja](https://instagram.com/______whiteboii)**

## Info

This **"Engine"** or what you may call library is made to help make your JavaScript life easier. In reality it's a hodge-podge of syntax shortcuts and methods that can be beneficial to you depending upon the needs of your project. This was mainly built for the programs and games I make for universal convenience. I know there is probably a better way to make a library like this but it has and continues to help my projects out a ton. Use it for what you need. As of right now there is a ***minified*** and ***unminified*** version of ``gearx-cs`` in the ``dist`` folder. The reason for the ``cs`` at the end stands for **Client Side** as I plan to integrate custom [socket.io](https://github.com/socketio/socket.io) methods into the engine for a **simpler** and more **streamlined** network experience.

Other external libraries in which this program can utilize:

* **[three.js](https://github.com/mrdoob/three.js/)**

Again, thank you for choosing to use my **"Engine"**

## Installation

* If you intend to use any external libraries that GearX utilizes, they must be imported before GearX. This is done to ensure the Engine doesn't run into any errors when trying to take advantage of those libraries.
```html
<script src="three.js"></script>
<script src="gearx-cs.js"></script>
```
* As of this release there is no NPM package of this engine so it must be installed through **HTML** or **Shorthand JavaScript**

## Usage

* There is already a variable called ``Engine`` embedded in the script. In turn, any other declaration of a variable with this exact name and capitalization might cause errors. This is meant for you to use from the start without having to declared a new variable for the engine. Inside the unminified file it looks like this:
```javascript
let Engine = new GearX( { three: THREE ? THREE : false } )
```
* The embedded ``Engine`` variable looks for ``THREE`` as its representative for [three.js](https://github.com/mrdoob/three.js/). If ``THREE`` does not exist, it will automatically cancel out all actions in that instance of the engine that utilize [three.js](https://github.com/mrdoob/three.js/).
* Basically the same as most other libraries. If you are using [three.js](https://github.com/mrdoob/three.js/) for example, you would use it like this:
```javascript
let engine = new GearX( { three: THREE } )
```
* Of course the variable chosen as the value for the ``three`` property depends on what you have [three.js](https://github.com/mrdoob/three.js/) represented as.
