    /*
    * GearZ ( Client Side ) - r1.11
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

    function GearZ ( addEvents, libReps ) {
        let _this = this
        let presets = {
            libReps: {},
        }

        if ( libReps ) {
            presets.libReps = {
                three: libReps.three ? libReps.three : null
            }
        }

        /* essential variables */
        this.three = presets.libReps.three // global variable that represents three.js
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

        this.elements = {
            dropdowns: {},
        }

        this.audio = {
            stored: {},
            play: ( audio, options ) => {
                if ( this.audio.stored[ audio ] ) {
                    this.audio.stored[ audio ].play()
                    this.audio.stored[ audio ].volume = 1
                    this.audio.stored[ audio ].loop = false

                    if ( options ) {
                        if ( options.volume ) this.audio.stored[ audio ].volume = options.volume
                        if ( options.loop ) this.audio.stored[ audio ].loop = options.loop
                    }
                } else this.log( `"${ audio }" was not found.` ).error()
            },
            pause: audio => {
                if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].pause()
                else this.log( `"${ audio }" was not found.` ).error()
            },
            add: {
                single: ( name, url ) => this.audio.stored[ name ] = new Audio( url ),
                multi: audioArray => audioArray.forEach( audio => this.audio.stored[ audio[ 0 ] ] = new Audio( audio[ 1 ] ) ),
            },
            change: {
                volume: ( audio, volume ) => {
                    if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].volume = volume
                    else this.log( `"${ audio }" was not found.` ).error()
                },
                loop: ( audio, loop ) => {
                    if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].loop = loop
                    else this.log( `"${ audio }" was not found.` ).error()
                },
            },
            retrieve: {
                volume: audio => {
                    if ( this.audio.stored[ audio ] ) return this.audio.stored[ audio ].volume
                    else this.log( `"${ audio }" was not found.` ).error()
                },
                loop: audio => {
                    if ( this.audio.stored[ audio ] ) return this.audio.stored[ audio ].loop
                    else this.log( `"${ audio }" was not found.` ).error()
                }
            }
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
        this.dropdown = element => {
            let dropdown = document.getElementById( element )

            if ( dropdown.tagName == 'DROPDOWN' ) {
                let presets = this.elements.dropdowns[ element ]

                const values = {
                    change: ( ...args ) => {
                        let topOffset = 0
                        let variation = 0

                        this.element( `${ element }-content` ).clear()

                        args.forEach( value => {
                            this.element( `${ element }-content` ).render( `
                                <dropdown-option id="${ element }-option-${ value }" label="${ value }" parent="${ element }" style="position: absolute; left: 0; top: ${ topOffset + presets.parent.unit }; width: ${ presets.content.v.w }; height: ${ presets.content.v.h + presets.parent.unit }; background-color: ${ presets.content.v.v[ variation ] }; padding: ${ presets.content.v.p + presets.parent.unit }; box-shadow: ${ presets.content.v.sh }; font-family: ${ presets.content.v.f }; font-size: ${ presets.content.v.s + presets.parent.unit }; font-weight: ${ presets.content.v.we }; text-align: ${ presets.content.v.a }; color: ${ presets.content.v.c }; transition: ${ presets.content.v.t }; z-index: 12;" class="dropdown dropdown-option">${ value }</dropdown-option>
                            ` )
                                
                            topOffset += presets.content.v.h + ( presets.content.v.p * 2 )
                            variation++
        
                            if ( variation == presets.content.v.v.length ) variation = 0
                        } )

                        presets.values = args

                        if ( presets.content.overflow != 'auto' ) presets.content.maxHeight = ( presets.content.v.h + ( presets.content.v.p * 2 ) ) * presets.values.length
                        else presets.content.overflow = 'auto'

                        this.element( `${ element }-content` ).actions.setHeight( presets.content.maxHeight, presets.parent.unit )
                        this.element( `${ element }-content` ).actions.setHeight( 0, presets.parent.unit )
                    },
                }

                return {
                    values: values
                }
            } else this.log( 'This element is not a dropdown' ).error()
        }

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
                dropdown: ( id, values, actions, pAttr, lAttr, aAttr, cAttr ) => {
                    let presets = {
                        parent: {},
                        label: {},
                        arrow: {},
                        content: {},
                        values: values,
                    }

                    if ( pAttr ) {
                        presets.parent = {
                            h: {
                                r: pAttr.hR ? pAttr.hR : '0',
                                s: pAttr.hS ? pAttr.hS : 'none',
                            },
                            o: {
                                h: pAttr.oH ? pAttr.oH : 'left',
                                v: pAttr.oV ? pAttr.oV : 'top',
                            },
                            m: {
                                l: pAttr.mL ? pAttr.mL : 0,
                                r: pAttr.mR ? pAttr.mR : 0,
                                t: pAttr.mT ? pAttr.mT : 0,
                                b: pAttr.mB ? pAttr.mB : 0,
                            },
                            unit: pAttr.unit ? pAttr.unit : this.units.vh,
                            width: pAttr.width ? pAttr.width : 6,
                            height: pAttr.height ? pAttr.height : 3,
                            bgColor: pAttr.bgColor ? pAttr.bgColor : 'rgba(0,0,0,0.4)',
                            roundness: pAttr.roundness ? pAttr.roundness : '0vh',
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
                                    i: lAttr.tI ? lAttr.tI : '0', // text info
                                },
                                padding: lAttr.padding ? lAttr.padding : 0.5, // text color
                            }

                            if ( presets.label.t.s == 'auto' ) {
                                if ( presets.parent.unit == this.units.vh ) presets.label.t.s = presets.parent.height - 1.5
                                else if ( presets.parent.unit == this.units.px ) presets.label.t.s = presets.parent.height - 15
                            } else {
                                if ( presets.parent.unit == this.units.vh ) presets.label.padding = ( presets.parent.height - ( presets.label.t.s + 0.5 ) ) / 2
                                else if ( presets.parent.unit == this.units.px ) presets.label.padding = ( presets.parent.height - ( presets.label.t.s + 5 ) ) / 2
                            }

                            if ( aAttr ) {
                                presets.arrow = {
                                    r: {
                                        f: aAttr.rF ? aAttr.rF : -90, // from
                                        t: aAttr.rT ? aAttr.rT : -180, // to
                                    },
                                    i: {
                                        l: aAttr.iL ? aAttr.iL : 'https://www.pngkit.com/png/full/44-440751_transparent-triangle-white-white-triangle-png.png', // image link
                                        s: aAttr.iS ? aAttr.iS : 40, // image size in percent
                                    },
                                    transition: aAttr.transition ? aAttr.transition : 'none',
                                }

                                if ( cAttr ) {
                                    presets.content = {
                                        v: {
                                            w: null,
                                            h: cAttr.vH ? cAttr.vH : 3, // value height
                                            p: cAttr.vP ? cAttr.vP : 0.5, // value padding
                                            s: cAttr.vS ? cAttr.vS : 'auto', // value text size
                                            c: cAttr.vC ? cAttr.vC : 'white', // value text color
                                            a: cAttr.vA ? cAttr.vA : 'center', // value text align
                                            f: cAttr.vF ? cAttr.vF : 'Trebuchet MS', // value text font
                                            t: cAttr.vT ? cAttr.vT : 'none', // value transition
                                            v: cAttr.vV ? cAttr.vV : [ 'rgba(0,0,0,0.3)', 'transparent' ], // value background color variation
                                            sh: cAttr.vSh ? cAttr.vSh : 'none', // value shadow
                                            we: cAttr.vWe ? cAttr.vWe : 'bolder', // value text weight
                                            shT: cAttr.vShT ? cAttr.vShT : 'none', // value text shadow
                                        },
                                        h: {
                                            c: cAttr.hC ? cAttr.hC : 'white', // value text color
                                            sh: cAttr.hSh ? cAttr.hSh : 'none', // value shadow
                                            shT: cAttr.hShT ? cAttr.hShT : 'none', // value text shadow
                                        },
                                        overflow: 'hidden',
                                        bgColor: cAttr.bgColor ? cAttr.bgColor : 'rgba(0,0,0,0.7)',
                                        maxHeight: cAttr.maxHeight ? cAttr.maxHeight : 'auto',
                                        roundness: cAttr.roundness ? cAttr.roundness : '0vh',
                                        transition: cAttr.transition ? cAttr.transition : 'none',
                                        shadow: cAttr.shadow ? cAttr.shadow : 'none',
                                    }

                                    if ( presets.content.v.s == 'auto' ) {
                                        if ( presets.parent.unit == this.units.vh ) presets.content.v.s = presets.content.v.h - 1.5
                                        else if ( presets.parent.unit == this.units.px ) presets.content.v.s = presets.content.v.h - 15
                                    } else {
                                        if ( presets.parent.unit == this.units.vh ) presets.content.v.p = ( presets.content.v.h - ( presets.content.v.s + 0.5 ) ) / 2
                                        else if ( presets.parent.unit == this.units.px ) presets.content.v.p = ( presets.content.v.h - ( presets.content.v.s + 5 ) ) / 2
                                    }

                                    presets.content.v.h -= presets.content.v.p * 2
                                    presets.content.v.w = `calc( 100% - ${ ( presets.content.v.p * 2 ) + presets.parent.unit } )`

                                    if ( presets.content.maxHeight == 'auto' ) presets.content.maxHeight = ( presets.content.v.h + ( presets.content.v.p * 2 ) ) * presets.values.length
                                    else presets.content.overflow = 'auto'

                                } else Engine.log( 'Input all neccessary parameters to create' ).error()
                            } else Engine.log( 'Input all neccessary parameters to create' ).error()
                        } else Engine.log( 'Input all neccessary parameters to create' ).error()
                    } else Engine.log( 'Input all neccessary parameters to create' ).error()

                    this.element( element ).render( `
                        <dropdown id="${ id }" parent="${ id }" style="position: absolute; ${ presets.parent.o.h }: 0; ${ presets.parent.o.v }: 0; width: ${ presets.parent.width + presets.parent.unit }; height: ${ presets.parent.height + presets.parent.unit }; background-color: ${ presets.parent.bgColor }; border-radius: ${ presets.parent.roundness }; box-shadow: ${ presets.parent.shadow }; margin: ${ presets.parent.m.t + presets.parent.unit } ${ presets.parent.m.r + presets.parent.unit } ${ presets.parent.m.b + presets.parent.unit } ${ presets.parent.m.l + presets.parent.unit }; transition: ${ presets.parent.transition };" class="dropdown">
                            <dropdown-label id="${ id }-label" parent="${ id }" style="position: absolute; left: 0; top: 0; width: calc( 100% - ${ ( presets.parent.height + ( presets.label.padding * 2 ) ) + presets.parent.unit } ); height: ( 100% - ${ ( presets.label.padding * 2 ) + presets.parent.unit } ); background-color: transparent; box-shadow: none; font-family: ${ presets.label.t.f }; font-size: ${ presets.label.t.s + presets.parent.unit }; font-weight: ${ presets.label.t.w }; text-align: ${ presets.label.t.a };  color: ${ presets.label.t.c }; padding: ${ presets.label.padding + presets.parent.unit }; padding-left: ${ ( presets.label.padding * 2 ) + presets.parent.unit }; z-index: 10;" class="dropdown">${ presets.label.t.i }</dropdown-label>
                            <dropdown-arrow id="${ id }-arrow" parent="${ id }" style="position: absolute; right: 0; top: 0; margin: 0; width: ${ presets.parent.height + presets.parent.unit }; height: ${ presets.parent.height + presets.parent.unit };background-size: ${ presets.arrow.i.s }%; background-image: url( ${ presets.arrow.i.l } ); background-position: center; background-repeat: no-repeat; transform: rotate( ${ presets.arrow.r.f }deg ); transition: ${ presets.arrow.transition };" class="dropdown" z-index: 10;></dropdown-arrow>
                            <dropdown-content id="${ id }-content" parent="${ id }" style="position: absolute; left: 0; top: 0; width: 100%; height: 0${ presets.parent.unit }; background-color: ${ presets.content.bgColor }; border-radius: ${ presets.content.roundness }; box-shadow: ${ presets.content.shadow }; margin-top: ${ presets.parent.height + presets.parent.unit }; transition: ${ presets.content.transition }; overflow-x: hidden; overflow-y: ${ presets.content.overflow }; z-index: 11;" class="dropdown"></dropdown-content>
                        </dropdown>
                    ` ).custom()

                    let topOffset = 0
                    let variation = 0

                    presets.values.forEach( ( value, index ) => {
                        this.element( `${ id }-content` ).render( `
                            <dropdown-option id="${ id }-option-${ value }" label="${ value }" parent="${ id }" style="position: absolute; left: 0; top: ${ topOffset + presets.parent.unit }; width: ${ presets.content.v.w }; height: ${ presets.content.v.h + presets.parent.unit }; background-color: ${ presets.content.v.v[ variation ] }; padding: ${ presets.content.v.p + presets.parent.unit }; box-shadow: ${ presets.content.v.sh }; font-family: ${ presets.content.v.f }; font-size: ${ presets.content.v.s + presets.parent.unit }; font-weight: ${ presets.content.v.we }; text-align: ${ presets.content.v.a }; color: ${ presets.content.v.c }; transition: ${ presets.content.v.t }; z-index: 12;" class="dropdown dropdown-option">${ value }</dropdown-option>
                        ` )
                        
                        topOffset += presets.content.v.h + ( presets.content.v.p * 2 )
                        variation++

                        if ( variation == presets.content.v.v.length ) variation = 0
                    } )

                    this.elements.dropdowns[ id ] = presets

                    if ( actions ) {
                        // if ( actions.mouseover ) {
                        //     this.events.document.mouseover.events[ 'dropdown' ] = actions.mouseover
                        // }
                    }
                    
                        this.events.add( 'document', 'mouseover', 'dropdown-management', target => {
                            if ( target.classList.contains( 'dropdown' ) ) {
                                let parent = target.getAttribute( 'parent' )

                                _this.element( parent ).actions.setShadows( this.elements.dropdowns[ parent ].parent.h.s )
                                _this.element( parent ).actions.setRoundness( this.elements.dropdowns[ parent ].parent.h.r )
                                _this.element( `${ parent }-arrow` ).actions.setTransform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.t }deg )` )
                                _this.element( `${ parent }-content` ).actions.setHeight( this.elements.dropdowns[ parent ].content.maxHeight, this.elements.dropdowns[ parent ].parent.unit )

                                if ( target.classList.contains( 'dropdown-option' ) ) {
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setShadows( this.elements.dropdowns[ parent ].content.h.sh )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setTextShadow( this.elements.dropdowns[ parent ].content.h.shT )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setTextColor( this.elements.dropdowns[ parent ].content.h.c )
                                }
                            }
                        } )

                        this.events.add( 'document', 'mouseout', 'dropdown-management', target => {
                            if ( target.classList.contains( 'dropdown' ) ) {
                                let parent = target.getAttribute( 'parent' )

                                _this.element( parent ).actions.setShadows( this.elements.dropdowns[ parent ].parent.shadow )
                                _this.element( parent ).actions.setRoundness( this.elements.dropdowns[ parent ].parent.roundness )
                                _this.element( `${ parent }-arrow` ).actions.setTransform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.f }deg )` )
                                _this.element( `${ parent }-content` ).actions.setHeight( 0, this.elements.dropdowns[ parent ].parent.unit )

                                if ( target.classList.contains( 'dropdown-option' ) ) {
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setShadows( this.elements.dropdowns[ parent ].content.v.sh )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setTextShadow( this.elements.dropdowns[ parent ].content.v.shT )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'label' ) }` ).actions.setTextColor( this.elements.dropdowns[ parent ].content.v.c )
                                }
                            }
                        } )

                        this.events.add( 'document', 'click', 'dropdown-option-management', target => {
                            if ( target.classList.contains( 'dropdown-option' ) ) {
                                let parent = target.getAttribute( 'parent' )
                                
                                _this.element( parent ).actions.setShadows( this.elements.dropdowns[ parent ].parent.shadow )
                                _this.element( parent ).actions.setRoundness( this.elements.dropdowns[ parent ].parent.roundness )
                                _this.element( `${ parent }-label` ).actions.setText( target.getAttribute( 'label' ) )
                                _this.element( `${ parent }-arrow` ).actions.setTransform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.f }deg )` )
                                _this.element( `${ parent }-content` ).actions.setHeight( 0, this.elements.dropdowns[ parent ].parent.unit )
                            }
                        } )
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

                    const whenShowing = ( func, interval ) => {
                        const interv = interval ? interval : 0.5

                        this.wait( () => {
                            if ( thisEl.style.display == 'inline-block' ) {
                                this.log( `${ element } is now showing` ).reg()
                            
                                this.wait( func, 0 )
                            } else whenShowing( func, interv )
                        }, interv )
                    }
    
                    return {
                        whenShowing: whenShowing
                    }
                }
            }
            const make = content => {
                const style = () => {
                    try {
                        thisEl.setAttribute( 'style', content )
                    } catch {
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
                setTextShadow: shadow => thisEl.style.textShadow = shadow,
                setShadows: shadows => thisEl.style.boxShadow = shadows,
                setAttr: ( attr, value ) => thisEl.setAttribute( attr, value ),
                getAttr: attr => thisEl.getAttribute( attr ),
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

        this.isParent = ( refNode, otherNode ) => {
            let parent = otherNode.parentNode

            do {
                if ( refNode == parent ) return true
                else parent = parent.parentNode
            } while ( parent )

            return false
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
            this.wait( func, waitTime )

            return {
                then: this.then
            }
        }

        this.log = content => {
            const header = '[ GearZ ]'

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
                vec2: () => { return new this.three.Vector2() },
                scene: () => { return new this.three.Scene() },
                clock: () => { return new this.three.Clock() },
                raycaster: () => { return new this.three.Raycaster() },
                cameras: {
                    perspective: ( fov, aspect, near, far ) => { return new this.three.PerspectiveCamera( fov, aspect, near, far ) },
                },
                loaders: {
                    texture: path => { return new this.three.TextureLoader().setPath( path ) },
                    gltf: path => {
                        if ( this.three.GLTFLoader != undefined ) return new this.three.GLTFLoader().setPath( path ) 
                    },
                },
                renderers: {
                    webGL: options => { return new this.three.WebGLRenderer( options ) },
                    css2d: () => {
                        if ( this.three.CSS2DRenderer != undefined ) return new this.three.CSS2DRenderer()
                    },
                    css3d: () => {
                        if ( this.three.CSS3DRenderer != undefined ) return new this.three.CSS3DRenderer()
                    },
                },
                controls: {
                    map: ( camera, rendererElement ) => {
                        if ( this.three.MapControls != undefined ) return new this.three.MapControls( camera, rendererElement )
                    }
                },
                mesh: mesh => {
                    const dispose = {
                        geometry: () => mesh.geometry.dispose(),
                        material: () => mesh.material.dispose(),
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
                    animClass: class {
                        constructor() {
                            this.previous = null
                            this.current = null
                        }
                    },
                    list: new Array(),
                    add: ( name, model ) => {
                        this.threeJS.animations[ name ] = new this.three.AnimationMixer( model.scene )
                        this.threeJS.animations[ name ].model = model
                        this.threeJS.animations[ name ].animations = new this.threeJS.animations.animClass()
                        this.threeJS.animations.list.push( name )
                    },
                    set: name => {
                        const current = number => this.threeJS.animations[ name ].animations.current = number
                        const previous = number => this.threeJS.animations[ name ].animations.previous = number
                        const playing = boolean => this.threeJS.animations[ name ].animations.playing = boolean

                        return {
                        current: current,
                        previous: previous,
                        playing: playing
                        }
                    },
                    play: name => {
                        const all = () => this.threeJS.animations[ name ].model.animations.forEach( clip => this.threeJS.animations[ name ].clipAction( clip ).play() )
                        const clip = number => {
                            this.threeJS.animations[ name ].clipAction( this.threeJS.animations[ name ].model.animations[ number ] ).play()

                            if ( this.threeJS.animations[ name ].animations.current ) {
                                this.threeJS.animations.set( name ).previous( this.threeJS.animations[ name ].animations.current )
                                this.threeJS.animations.set( name ).current( number )
                            } else this.threeJS.animations.set( name ).current( number )

                            this.threeJS.animations.set( name ).playing( true )
                        }
                        const previous = () => this.threeJS.animations[ name ].clipAction( this.threeJS.animations[ name ].animations.previous ).play()

                        return {
                            all: all,
                            clip: clip,
                            previous: previous
                        }
                    },
                    update: delta => this.threeJS.animations.list.forEach( object => this.threeJS.animations[ object ].update( delta ) ),
                },
            }
        } else {
            this.threeJS = {}
        }
        
        /* universal event manager */
        this.events = {
            document: {
                mouseover: {
                    events: {},
                    listener: e => { for ( sEvent in this.events.document.mouseover.events ) this.events.document.mouseover.events[ sEvent ]( e.target ) },
                },
                mouseout: { 
                    events: {},
                    listener: e => { for ( sEvent in this.events.document.mouseout.events ) this.events.document.mouseout.events[ sEvent ]( e.target ) },
                },
                click: { 
                    events: {},
                    listener: e => { for ( sEvent in this.events.document.click.events ) this.events.document.click.events[ sEvent ]( e.target ) },
                },
            },
            check: ( type, mEvent, name ) => {
                if ( this.events[ type ] ){
                    if ( this.events[ type ][ mEvent ] ){
                        if ( this.events[ type ][ mEvent ].events[ name ] ) return true 
                        else return false 
                    } else this.log( `"${ mEvent }" is not an event listener` ).error()
                } else this.log( `"${ type }" is not an event type` ).error()
            },
            add: ( type, mEvent, name, func ) => {
                if ( !this.events.check( type, mEvent, name ) ) this.events[ type ][ mEvent ].events[ name ] = func
                else this.log( `An event named "${ name }" already exists` ).reg()

                const overide = () => {
                    this.events[ type ][ mEvent ].events[ name ] = func

                    this.log( `An event named "${ name }" that already exists has now been overidden` ).reg()
                }

                return {
                    overide: overide
                }
            },
            init: () => {  
                for ( mEvent in this.events.document ) {
                    document.addEventListener( mEvent, this.events.document[ mEvent ].listener )
                }
            }
        }

        if ( addEvents ) this.events.init()
    }