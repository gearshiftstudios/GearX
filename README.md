# The GearZ Engine
A library to make the JS life more relaxing.
Thought of and programmed by **[Nikolas Karinja](https://instagram.com/______whiteboii)**

## Info
This **"Engine"** or what you may call library is made to help make your JavaScript life easier. In reality it's a hodge-podge of syntax shortcuts and methods that can be beneficial to you depending upon the needs of your project. This was mainly built for the programs and games I make for universal convenience. I know there is probably a better way to make a library like this but it has and continues to help my projects out a ton. Use it for what you need. As of right now there is a ***minified*** and ***unminified*** version of ``gearx-cs`` in the ``dist`` folder. The reason for the ``cs`` at the end stands for **Client Side** as I plan to integrate custom [socket.io](https://github.com/socketio/socket.io) methods into the engine for a **simpler** and more **streamlined** network experience.

Other external libraries in which this program can utilize:

* **[three.js](https://github.com/mrdoob/three.js/)**

Again, thank you for choosing to use my **"Engine"**

## Installation
If you intend to use any external libraries that GearZ utilizes, they must be imported before GearZ. This is done to ensure the Engine doesn't run into any errors when trying to take advantage of those libraries.
```html
<script src="three.js"></script>
<script src="gearx-cs.js"></script>
```
As of this release there is no NPM package of this engine so it must be installed through **HTML** or **Shorthand JavaScript**

## Usage (Updated)
The engine is ``function`` based ``class``, so you can call it by doing declaring a constant to represent it. Seen below.
```javascript
const gearz = new GearZ( true, { three: THREE }, false )
```
* If the first parameter is set to ``true``, then the ***Universal Event Manager*** will start listening for the added and preset mouse-events. This means there will be events running all the time in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).
* If second parameter is not empty, the engine will expect you to insert the **variable representatives** of the external libraries you wish the engine to manage. As long as it is in the list of external libraries the engine supports, then there will be no errors (see **info** as the top of the document). As of right now, the engine can manage [three.js](https://github.com/mrdoob/three.js/) and has some custom **methods & properties** that make using [three.js](https://github.com/mrdoob/three.js/) somewhat easier. Keep in mind the main focus of engine is handling [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).
* If the third parameter is set to ``true``, then the meshes the engine was told to put into ``localStorage`` will be loaded into the engine's ***temporary mesh storage object*** for your program to access.

## Cool Examples
Below are some examples showing off the engine's capabilities.
* [Builder](https://gearshiftstudios.github.io/GearZ/examples/builder.html) (WIP for **Civilia** development)
* [Loading and Storing Meshes](https://gearshiftstudios.github.io/GearZ/examples/loading_stored_meshes.html)

Below is a screenshot taken on 6/12/21 (the most current commit) of the builder example.

![image](https://user-images.githubusercontent.com/28771488/121796241-ea56e280-cbd4-11eb-9f4c-ded3c73da661.png)

## Newest & Useful Features
Below are some of the newest features added to the engine.

### Creating a full [three.js](https://github.com/mrdoob/three.js/) scene in two lines
It can't get much more simpler than this. With just two lines, you can create a full [three.js](https://github.com/mrdoob/three.js/) scene (that includes a ``PerspectiveCamera``, ``WebGLRenderer`` (initialized with ``antialias`` and ``alpha`` options set to ``true``), ``GridHelper``, ``HemisphereLight`` and ``DirectionalLight`` (although only the ``HemisphereLight`` is initially added to the scene), and ``OrbitControls``). You need to include the ``OrbitControls`` script in your program if you want yo use it. You can change all these things afterwords of course. Soon you will be able to create a more precise scene using this method.
```javascript
/* create a simple three.js scene */
const world = gearz.threeJS.create.world() // store the data in a variable
world.init( true ) // initialize it with OrbitControls
```
Of course, you have to allow it to render every frame to get a smooth image. Below is the least amount of code needed to create a scene with an ***animation cycle*** (including ``OrbitControls``).
```javascript
/* create a simple three.js scene with animation cycle */
const gearz = new GearZ( true, { three: THREE }, false ) // store and intialize engine data

const world = gearz.threeJS.create.world() // store the scene data
world.init( true ) // initialize scene with OrbitControls

/* animation cycle */
const animate = () => {
    requestAnimationFrame( animate )

    world.render() // needed to render scene (controls automatically update)
}

animate()
```
To see a live example of this in action, [check this out](https://gearshiftstudios.github.io/GearZ/examples/simple_three_scene.html).

### Dynamic Dropdown Menu Creation
You can make dropdown menus with custom UI based upon the properties you attribute to it. It's possible to create a really simple one with just this short amount of code:
```javascript
gearz.element( 'body' ).add.dropdown( 'sports-drop', [ [ 'Football', 0 ], [ 'Baseball', 1 ], [ 'Basketball', 2 ] ], {}, { width: 13, mL: 1, mT: 1 }, { tI: 'Pick a Sport' }, {}, {} )
```
With just a few more properties and attributes you can make your dropdown look professional.
