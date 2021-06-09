# The GearZ Engine
A library to make the JS life more relaxing.
Thought of and programmed by **[Nikolas Karinja](https://instagram.com/______whiteboii)**

## Info
This **"Engine"** or what you may call library is made to help make your JavaScript life easier. In reality it's a hodge-podge of syntax shortcuts and methods that can be beneficial to you depending upon the needs of your project. This was mainly built for the programs and games I make for universal convenience. I know there is probably a better way to make a library like this but it has and continues to help my projects out a ton. Use it for what you need. As of right now there is a ***minified*** and ***unminified*** version of ``gearx-cs`` in the ``dist`` folder. The reason for the ``cs`` at the end stands for **Client Side** as I plan to integrate custom [socket.io](https://github.com/socketio/socket.io) methods into the engine for a **simpler** and more **streamlined** network experience.

Other external libraries in which this program can utilize:

* **[three.js](https://github.com/mrdoob/three.js/)**

Again, thank you for choosing to use my **"Engine"**

## Installation
* If you intend to use any external libraries that GearZ utilizes, they must be imported before GearZ. This is done to ensure the Engine doesn't run into any errors when trying to take advantage of those libraries.
```html
<script src="three.js"></script>
<script src="gearx-cs.js"></script>
```
* As of this release there is no NPM package of this engine so it must be installed through **HTML** or **Shorthand JavaScript**

## Usage (Updated)
* The engine is ``function`` based ``class``, so you can call it by doing declaring a constant to represent it. Seen below.
```javascript
const gearz = new GearZ( true, { three: THREE }, false )
```
* If the first parameter is set to ``true``, then the ***Universal Event Manager*** will start listening for the added and preset mouse-events. This means there will be events running all the time in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).
* If second parameter is not empty, the engine will expect you to insert the **variable representatives** of the external libraries you wish the engine to manage. As long as it is in the list of external libraries the engine supports, then there will be no errors (see **info** as the top of the document). As of right now, the engine can manage [three.js](https://github.com/mrdoob/three.js/) and has some custom **methods & properties** that make using [three.js](https://github.com/mrdoob/three.js/) somewhat easier. Keep in mind the main focus of engine is handling [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).

## Usage (Outdated)
* There is already a variable called ``Engine`` embedded in the script. In turn, any other declaration of a variable with this exact name and capitalization might cause errors. This is meant for you to use from the start without having to declared a new variable for the engine. Inside the unminified file it looks like this:
```javascript
const Engine = new GearZ( true, {} )
```
* The embedded ``Engine`` variable looks for ``THREE`` as its representative for [three.js](https://github.com/mrdoob/three.js/). If ``THREE`` does not exist, it will automatically cancel out all actions in that instance of the engine that utilize [three.js](https://github.com/mrdoob/three.js/).
* Basically the same as most other libraries. If you are using [three.js](https://github.com/mrdoob/three.js/) for example, you would use it like this:
```javascript
let engine = new GearZ( true, { three: THREE } )
```
* Of course the variable chosen as the value for the ``three`` property depends on what you have [three.js](https://github.com/mrdoob/three.js/) represented as.

## Newest Features
Below are some of the newest features added to the engine.

### Dynamic Dropdown Menu Creation
You can make dropdown menus with custom UI based upon the properties you attribute to it. It's possible to create a really simple one with just this short amount of code:
```javascript
Engine.element( 'body' ).add.dropdown( 'sports-drop', [ 'Football', 'Baseball', 'Basketball' ], {}, { width: 13, mL: 1, mT: 1 }, { tI: 'Pick a Sport' }, {}, {} )
```
You can check this out along with 3 other dropdowns in this [example](https://gearshiftstudios.github.io/GearZ/examples/dropdowns.html) here. With just a few more properties and attributes you can make look professional.
