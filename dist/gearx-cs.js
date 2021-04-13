/*
 * GearX ( Client Side ) - r1.3
 *
 * Copyright 2021
 * Author: Nikolas Karinja
 * All Rights Reserved.
 * 
 * I N F O
 * 
 * This "Engine" or what you may call library is made to help make your JavaScript life easier. In reality
 * it's a hodge-podge of syntax shortcuts and methods that can be beneficial to you depending upon the needs
 * of your project. This was mainly built for the programs and games I make for universal convenience. I know
 * there is probably a better way to make a library like this but it has and continues to help my projects 
 * out a ton. Utilize for what you need.
 * 
 * Other external libraries in which this program can utilize:
 * 
 * - three.js
 * - socket.io
 * 
 * Again, thank you for choosing to use my "Engine"
 * 
 * I N S T A L L A T I O N
 * 
 * - If you intend to use any external libraries that GearX utilizes, they must be imported before GearX. This
 *   is done to ensure the Engine doesn't run into any errors when trying to take advantage of those libraries.
 * 
 *            ___________________HTML__________________
 *            |                                       |
 *   EXAMPLE: |  <script src="three.js"></script>     |
 *            |  <script src="gearx-cs.js"></script>  |
 *            |_______________________________________|
 * 
 * - As of this release there is no NPM package of this engine so it must be installed through HTML or Shorthand JavaScript
 *  
 * U S A G E
 * 
 * - There is already a variable called "Engine" embedded in the script. In turn, any other declaration of a variable
 *   with this exact name and capitalization might cause errors.
 * - The embedded "Engine" variable looks for "THREE" as its representative for <three.js>. If "THREE" does not exist, it 
 *   will automatically cancel out all actions in that instance of the engine that utilize <three.js>.
 * - Basically the same as most other libraries. If you are using <three.js> for example, you would use it like this:
 * 
 *            ____________________JavaScript__________________
 *            |                                              |
 *   EXAMPLE: |  let engine = new GearX( { three: THREE } )  |
 *            |______________________________________________|
 * 
 *   Of course the variable chosen as the value for the "three" property depends on what you have <three.js> represented as.
 * 
*/

function GearX ( libReps ) {
    let _this = this

    /* essential variables */
    this.three = libReps.three ? libReps.three : false // global variable that represents three.js
    this.bools = new Array( true, false ) // array for random boolean method

    /* empty arrays and objects */
    this.preloadedImages = new Array()

    /* objects */
    this.units = {
        percent: '%',
        deg: 'deg',
        rad: 'rad',
        px: 'px',
        vh: 'vh',
        vw: 'vw',
    }
    
    this.operations = {
        parse: item => {
            try {
                return JSON.parse( item )
            } catch {
                this.log( 'Could not parse item' ).error()
            }
        },
        stringify: item => {
            try {
                return JSON.stringify( item )
            } catch {
                this.log( 'Could not stringify item' ).error()
            }
        },
        convert: ( unit, number ) => {
            const presets = {
                vh: window.innerHeight / 100,
                vw: window.innerWidth / 100,
                rad: Math.PI / 180,
                deg: 180 / Math.PI,
            }

            const to = {
                vh: () => {
                    if ( unit == 'px' ) return number / presets.vh
                    else if ( unit == 'vw' ) return ( presets.vw * number ) / presets.vh
                },
                vw: () => {
                    if ( unit == 'px' ) return number / presets.vw
                    else if ( unit == 'vh' ) return ( presets.vh * number ) / presets.vw
                },
                px: () => {
                    if ( unit == 'vh' ) return number * presets.vh
                    else if ( unit == 'vw' ) return number * presets.vw
                },
                rad: () => {
                    if ( unit == 'deg' ) return number * presets.rad
                },
                deg: () => {
                    if (unit == 'rad') return number * presets.deg
                }
            }

            return {
                to: to
            }
        },
        capitalizeFirstLetters: string => { return string.charAt( 0 ).toUpperCase() + string.slice( 1 ) },
        capitalizeAll: string => { return string.toUpperCase() },
        removeDigits: ( number, digitsToRemove ) => { return ( number - ( number % digitsRemoved ) ) / Math.pow( 10, digitsToRemove ) },
        shorten: ( subtractors, startSubtracted, endSubtracted ) => {
            if ( subtractors.length == 1 ) return subtractors[ 0 ].slice( startSubtracted, subtractors[ 0 ].length - endSubtracted )
            else if ( subtractors.length == 2 ) return subtractors[ 0 ].slice( startSubtracted, subtractors[ 1 ].length - endSubtracted )
        },
        random: {
            bool: () => { return this.bools[ Math.floor( Math.random() * this.bools.length ) ] },
            number: ( min, max ) => { return Math.random() * ( max - min ) + min },
        },
    },

    this.clear = {
        waiter: waiter => clearTimeout( waiter ),
        repeater: repeater => clearInterval( repeater ),
    },

    /* one-line methods */
    this.wait = ( wait, time ) => setTimeout( wait, time * 1000 )
    this.repeat = ( repeat, time ) => setInterval( repeat, time * 1000 )

    /* large methods */
    this.element = element => {
        const thisEl = document.getElementById( element )
        const render = content => {
            thisEl.innerHTML += content

            const custom = options => { 
                try {
                    if ( options ) {
                        options.forEach( option => {
                            if ( option[ 1 ].display ) {
                                document.getElementById( option[ 0 ] ).style.display = 'inline-block'
                            } else {
                                document.getElementById( option[ 0 ] ).style.display = 'none'
                            }
                        } )
                    }
                } catch {
                    this.log( `Problem adding custom content to element (${ element })` ).error()
                }
            }

            return {
                custom: custom
            }
        }
        const retrieve = {
            id: () => { return thisEl.id },
        }
        const remove = {
            listener: ( eventNames, listener ) => {
                let events = eventNames.split( ' ' )

                events.forEach( event => { thisEl.removeEventListener( event, listener, false ) } )
            },
            cl: cl => {
                try {
                    thisEl.classList.remove( cl )
                } catch {
                    this.log( `Problem removing class to element (${ element })` ).error()
                }
            }
        }
        const add = {
            listener: ( eventNames, listener ) => {
                let events = eventNames.split( ' ' )

                events.forEach( event => thisEl.addEventListener( event, listener, false ) )
            },
            child: childElement => thisEl.appendChild( childElement ),
            dropdown: ( id, values, pAttr, lAttr, aAttr, cAttr ) => {
                let presets = {
                    parent: {},
                    label: {},
                    arrow: {},
                    content: {},
                }

                if ( pAttr ) {
                    presets.parent = {
                        o: {
                            h: pAttr.oH ? pAttr.oH : 'left',
                            v: pAttr.oV ? pAttr.oV : 'top',
                        },
                        m: {
                            l: pAttr.ml ? pAttr.ml : 0,
                            r: pAttr.mR ? pAttr.mR : 0,
                            t: pAttr.mT ? pAttr.mT : 0,
                            b: pAttr.mB ? pAttr.mB : 0,
                        },
                        unit: pAttr.unit ? pAttr.unit : this.units.vh,
                        width: pAttr.width ? pAttr.width : 6,
                        height: pAttr.height ? pAttr.height : 3,
                        bgColor: pAttr.bgColor ? pAttr.bgColor : 'rgba(0,0,0,0.4)',
                        roundess: pAttr.roundness ? pAttr.roundness : '0vh',
                        transition: pAttr.transition ? pAttr.transition : 'none',
                        shadow: pAttr.shadow ? pAttr.shadow : 'none',
                    }

                    if ( lAttr ) {
                        presets.label = {
                            t: {
                                s: lAttr.tS ? lAttr.tS : 'auto', // text size
                                f: lAttr.tF ? lAttr.tF : 'Trebuchet MS', // text font
                                a: lAttr.tA ? lAttr.tA : 'center', // text alignment
                                w: lAttr.tW ? lAttr.tW : 'bolder', // text weight
                                c: lAttr.tC ? lAttr.tC : 'white', // text color
                            },
                        }

                        if ( presets.label.t.s == 'auto' ) {
                            if ( presets.parent.unit == this.units.vh ) presets.label.t.s = presets.parent.height - 1
                            else if ( presets.parent.unit == this.units.px ) presets.label.t.s = presets.parent.height - 10
                        }

                        if ( aAttr ) {

                        } else Engine.log( 'Input all neccessary parameters to create' ).error()

                    } else Engine.log( 'Input all neccessary parameters to create' ).error()
                } else Engine.log( 'Input all neccessary parameters to create' ).error()

                Element( element ).render( `
                    <dropdown id="${ id }" style="position: absolute; ${ presets.parent.o.h }: 0; ${ presets.parent.o.v }: 0; width: ${ presets.parent.width + presets.parent.unit }; height: ${ presets.parent.height + presets.parent.unit }; background-color: ${ presets.parent.bgColor }; border-radius: ${ presets.parent.roundness }; box-shadow: ${ presets.parent.shadow }; margin: ${ presets.parent.m.t + presets.parent.unit } ${ presets.parent.m.r + presets.parent.unit } ${ presets.parent.m.b + presets.parent.unit } ${ presets.parent.m.l + presets.parent.unit }; transition: ${ presets.parent.transition };">
                        <dropdown-label style="position: absolute; left: 0; top: 0; width: calc( 100% - ${ presets.parent.height + presets.parent.unit } ); height: 100%; background-color: transparent; box-shadow: none; font-family: ${ presets.label.t.f }; font-size: ${ presets.label.t.s }; font-weight: ${ presets.label.t.w }; text-align: ${ presets.label.t.a };  color: ${ presets.label.t.c };">Option</dropdown-label>
                    </dropdown>
                ` ).custom()
            },
            cl: cl => {
                try {
                    thisEl.classList.add( cl )
                } catch {
                    this.log( `Problem removing class to element (${ element })` ).error()
                }
            }
        }
        const check = {
            all: ( value, func, waitTime ) => thisEl.querySelectorAll( value ).forEach( () => _this.wait( func, waitTime ) ),
            cl: {
                includes: cl => { return thisEl.classList.contains( cl ) },
            },
            isShowing: () => {
                if ( thisEl.style.display == 'inline-block' ) return true
                else if ( thisEl.style.display == 'none' ) return false
            }
        }
        const make = content => {
            const style = () => {
                try {
                    thisEl.setpresetsibute( 'style', content )
                } catch(e) {
                    this.log( `Problem making style of element (${ element })` ).error()
                }
            }

            return {
                style: style,
            }
        }
        const dispose = () => {
            try {
                thisEl.remove()
            } catch {
                this.log( `Problem disposing element (${ element })` ).error()
            }
        }
        const clear = () => {
            try {
                thisEl.innerHTML = ''
            } catch {
                this.log( `Problem clearing element (${ element })` ).error()
            }
        }
        const actions = {
            hide: time => this.wait( () => { thisEl.style.display = "none" }, time ),
            show: time => this.wait( () => { thisEl.style.display = "inline-block" }, time ),
            setWidth: ( size, unit ) => thisEl.style.width = size + unit,
            setHeight: ( size, unit ) => thisEl.style.height = size + unit,
            setMarginLeft: ( margin, unit ) => thisEl.style.marginLeft = margin + unit,
            setMarginRight: ( margin, unit ) => thisEl.style.marginRight = margin + unit,
            setMarginTop: ( margin, unit ) => thisEl.style.marginTop = margin + unit,
            setMarginBottom: ( margin, unit ) => thisEl.style.marginBottom = margin + unit,
            setTransform: transform => thisEl.style.transform = transform,
            setFilter: filter => thisEl.style.filter = filter,
            setTransition: transition => thisEl.style.transition = transition,
            setPointerEvents: event => thisEl.style.pointerEvents = event,
            setRoundness: roundness => thisEl.style.borderRadius = roundness,
            setText: string => thisEl.innerHTML = string,
            setValue: value => thisEl.value = value,
            setZIndex: value => thisEl.style.zIndex = `${ value }`,
            setImage: link => thisEl.style.backgroundImage = 'url(' + link + ')',
            setMatrix: ( scale, left, top ) => thisEl.style.transform = 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + left + ', ' + top + ');',
            setTextColor: color => thisEl.style.color = color,
            setBackgroundSize: size => thisEl.style.backgroundSize = size,
            setBackgroundColor: color => thisEl.style.backgroundColor = color,
            setBackground: background => thisEl.style.background = background,
            setFill: fill => thisEl.style.fill = fill,
            setBorderColor: color => thisEl.style.borderColor = color,
            setOpacity: opacity => thisEl.style.opacity = (opacity * 100) + '%',
            clearImage: () => thisEl.style.backgroundImage = 'none',
            addListItem: information => thisEl.innerHTML += `<li>${information}</li>`,
            addListContainer: ( id, type ) => thisEl.innerHTML += `<${type} id='${id}'></${type}>`,
            setAnimation: animation => thisEl.style.animation = animation,
            setShadows: shadows => thisEl.style.boxShadow = shadows,
            getTransform: () => { return thisEl.style.transform },
            getValue: () => { return thisEl.value },
            getValueLength: () => {  return thisEl.value.length },
            getText: () => { return thisEl.innerHTML },
            setStroke: ( color, width, unit ) => {
                thisEl.style.stroke = color
                thisEl.style.strokeWidth = width + unit
            },
            moveAbs: ( left, right, top, bottom, unit, transition ) => {
                thisEl.style.marginLeft = left + unit
                thisEl.style.marginRight = right + unit
                thisEl.style.marginTop = top + unit
                thisEl.style.marginBottom = bottom + unit
                thisEl.style.transition = `${ transition }s ease-in-out`
            },
            enableDrag: () => {
                  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                  if (document.getElementById(`${ element }-header`)) {
                    // if present, the header is where you move the DIV from:
                    document.getElementById(`${ element }-header`).onmousedown = () => {
                        dragMouseDown()
                    }
                  } else {
                    // otherwise, move the DIV from anywhere inside the DIV:
                    thisEl.onmousedown = () => {
                            dragMouseDown()
                    }
                  }

                  const dragMouseDown = (e) => {
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = () => {
                        closeDragElement()
                        // document.body.style.cursor = controller.cursors.normal
                    };
                    // call a function whenever the cursor moves:
                    document.onmousemove = () => {
                        elementDrag()
                    };
                  }

                  const elementDrag = (e) => {
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    thisEl.style.marginTop = `${thisEl.offsetTop - pos2}px`;
                    thisEl.style.marginLeft = `${thisEl.offsetLeft - pos1}px`;
                  }

                  const closeDragElement = () => {
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;
                  }
            },
            updateLoader: (string) => {
                setInterval(() => {
                    thisEl.innerHTML = string + '.'
                    setTimeout(() => {
                        thisEl.innerHTML = string + '..'
                        setTimeout(() => {
                            thisEl.innerHTML = string + '...'
                        }, 300)
                    }, 300)
                }, 900)
            },
        }
        const exists = () => {
            return document.getElementById(element)

            function wait( func, interval ) {
                GearX.engine.wait( function() {
                    if ( thisEl ) {
                        GearX.engine.log( `${ element } now exists` ).reg()
                    
                        GearX.engine.wait( func, 0 )
                    } else {
                        wait()
                    }
                }, interval )
            }

            return {
                wait: wait
            }
        }
        return {
            render: render,
            dispose: dispose,
            add: add,
            remove: remove,
            retrieve: retrieve,
            clear: clear,
            actions: actions,
            make: make,
            exists: exists,
            check: check,
        }
    }

    this.preloadImages = array => {
        if ( !this.preloadedImages ) this.preloadedImages = new Array()

        let list = this.preloadedImages

        array.forEach( ( image ) => {
            let img = new Image()

            img.onload = () => {   
                let imgIndex = list.indexOf( this )

                if ( imgIndex != -1 ) list.splice( imgIndex, 1 )
            }

            list.push( img );
            img.src = image;
        } )
    }

    this.then = ( func, waitTime ) => {
        GearX.engine.wait( func, waitTime )

        return {
            then: this.then
        }
    }

    this.log = content => {
        const header = '[ GearX ]'

        const reg = () => {
            console.log( `${ header } ${ content }` )
        }
        const error = () => {
            console.error( `${ header } <!> ${ content }` )
        }

        return {
            reg: reg,
            error: error
        }
    }

    /* Three.js stuff */
    if ( this.three ) {
        this.log( 'three.js found' ).reg()

        this.threeJS = {
            raycaster: () => { return new this.three.Raycaster() },
            mesh: mesh => {
                const dispose = {
                    geometry: () => {
                        mesh.geometry.dispose()
                    },
                    material: () => {
                        mesh.material.dispose()
                    },
                    all: () => {
                        dispose.geometry()
                        dispose.material()
                    } 
                }

                const show = () => mesh.visible = true
                const hide = () => mesh.visible = false
                const isShowing = () => { return mesh.visible }

                return {
                    dispose: dispose,
                    show: show,
                    hide: hide,
                    isShowing: isShowing,
                }
            },
            loaders: {
                gltf: path => { return new this.three.GLTFLoader().setPath( path ) },
                texture: path => { return new this.three.TextureLoader().setPath( path ) },
            },
            materials: {
                faces: { names: [], data: [] },
                retrieveIndex: name => {
                    const face = () => { return this.threeJS.materials.faces.names.indexOf( name ) }

                    return {
                        face: face
                    }
                },
                add: ( name, options ) => {
                    const basic = () => {
                        let _material = new this.three.MeshBasicMaterial( {
                            color: new this.three.Color( options.color ),
                            side: this.three.DoubleSide,
                        } )

                        const face = () => {
                            this.threeJS.materials.faces.data.push( _material )
                            this.threeJS.materials.faces.names.push( name )
                        }

                        return {
                            face: face
                        }
                    }

                    return {
                        basic: basic
                    }
                },
            },
            animations: {
                list: new Array(),
                add: ( name, gltf ) => {
                    Animations[ name ] = new this.three.AnimationMixer( gltf.scene )
                    Animations[ name ].model = gltf
                    Animations[ name ].animations = new Anims()
                    Animations.list.push( name )
                },
                set: name => {
                    const current = number => Animations[ name ].animations.current = number
                    const previous = number => Animations[ name ].animations.previous = number
                    const playing = boolean => Animations[ name ].animations.playing = boolean

                    return {
                       current: current,
                       previous: previous,
                       playing: playing
                    }
                },
                play: name => {
                    const all = () => Animations[ name ].model.animations.forEach( clip => Animations[ name ].clipAction( clip ).play() )
                    const clip = number => {
                        Animations[ name ].clipAction( Animations[ name ].model.animations[ number ] ).play()

                        if ( Animations[ name ].animations.current ) {
                            Animations.set( name ).previous( Animations[ name ].animations.current )
                            Animations.set( name ).current( number )
                        } else Animations.set( name ).current( number )

                        Animations.set( name ).playing( true )
                    }
                    const previous = () => Animations[ name ].clipAction( Animations[ name ].animations.previous ).play()

                    return {
                        all: all,
                        clip: clip,
                        previous: previous
                    }
                },
                update: delta => Animations.list.forEach( object => Animations[ object ].update( delta ) ),
            },
        }
    } else {
        this.threeJS = {}
    }
}

/* premade init */
let Engine = new GearX( { three: THREE ? THREE : false } )

/* premade variables */
let Bools = Engine.bools
let Element = Engine.element
let Operations = Engine.operations