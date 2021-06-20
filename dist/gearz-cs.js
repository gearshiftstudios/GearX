
    /*
    * GearZ ( Client Side ) - r1.14
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
    *            |  <script src="gearz-cs.js"></script>  |
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
    *            _______________________JavaScript_____________________
    *            |                                                    |
    *   EXAMPLE: |  let engine = new GearZ( true, { three: THREE } )  |
    *            |____________________________________________________|
    * 
    *   Of course the variable chosen as the value for the "three" property depends on what you have <three.js> represented as.
    * 
    */

    function GearZ ( addEvents, libReps, loadStored3DData ) {
        const _this = this
        const presets = {
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

        this.elements = { dropdowns: {} }

        this.check = {
            exists: variable => {
                if ( typeof variable != 'undefined' ) return true
                else return false
            },
            typeOf: ( variable, type ) => {
                const _type = type ? type : 'string'

                if ( this.check.exists( variable ) ) {
                    if ( typeof variable == type ) return true
                    else return false
                }
            }
        }

        this.audio = {
            stored: {},
            play: ( audio, options ) => {
                if ( this.audio.stored[ audio ] ) {
                    const presets = {
                        volume: options.volume ? options.volume : 1,
                        loop: options.loop ? options.loop : false,
                        startTime: options.startTime ? options.startTime : 0,
                        transitionDurations: {
                            start: options.tSd ? options.tSd : 0,
                            end: options.tEd ? options.tEd : 0,
                        }
                    }

                    this.audio.stored[ audio ].volume = presets.volume
                    this.audio.stored[ audio ].loop = presets.loop
                    this.audio.stored[ audio ].currentTime = presets.startTime
                    this.audio.stored[ audio ].gearz = {
                        maxVolume: presets.volume,
                        startTime: presets.startTime,
                        transitions: {
                            start: [ null, presets.transitionDurations.start ], // repeater, duration
                            end: [ null, presets.transitionDurations.end ], // repeater, duration
                        }
                    }

                    this.audio.stored[ audio ].play()

                    this.audio.stored[ audio ].addEventListener( 'play', () => {
                        this.audio.fade( audio ).inward( this.audio.stored[ audio ].gearz.transitions.start[ 1 ] )
                    } )
                    
                    this.audio.stored[ audio ].addEventListener( 'playing', () => {
                        if ( ( this.audio.stored[ audio ].duration - this.audio.stored[ audio ].currentTime ) == this.audio.stored[ audio ].gearz.transitions.end[ 1 ] ) this.audio.fade( audio ).out( this.audio.stored[ audio ].gearz.transitions.end[ 1 ] )
                    } )
                } else this.log( `"${ audio }" was not found.` ).error()
            },
            pause: audio => {
                if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].pause()
                else this.log( `"${ audio }" was not found.` ).error()
            },
            fade: audio => {
                const inward = duration => {
                    if ( this.audio.stored[ audio ].gearz.transitions.start[ 0 ] ) this.clear.repeater( this.audio.stored[ audio ].gearz.transitions.start[ 0 ] )

                    this.audio.stored[ audio ].volume = 0

                    const volumeInterval = this.audio.stored[ audio ].gearz.maxVolume / ( ( duration * 1000 ) / 100 )

                    this.audio.stored[ audio ].gearz.transitions.start[ 0 ] = this.repeat( () => {
                        if ( ( this.audio.stored[ audio ].currentTime <= ( this.audio.stored[ audio ].gearz.startTime + duration ) ) && ( this.audio.stored[ audio ].volume != this.audio.stored[ audio ].gearz.maxVolume ) ) this.audio.stored[ audio ].volume += volumeInterval
                            
                        if ( this.audio.stored[ audio ].volume >= this.audio.stored[ audio ].gearz.maxVolume ) {
                            this.audio.stored[ audio ].volume = this.audio.stored[ audio ].gearz.maxVolume

                            this.clear.repeater( this.audio.stored[ audio ].gearz.transitions.start[ 0 ] )
                        }
                    }, 0.1 )
                }
                
                const out = duration => {
                    if ( this.audio.stored[ audio ].gearz.transitions.end[ 0 ] ) this.clear.repeater( this.audio.stored[ audio ].gearz.transitions.end[ 0 ] )

                    const volumeInterval = this.audio.stored[ audio ].gearz.maxVolume / ( ( duration * 1000 ) / 100 )

                    this.audio.stored[ audio ].gearz.transitions.end[ 0 ] = this.repeat( () => {
                        if ( this.audio.stored[ audio ].volume != 0 ) {
                            if ( this.audio.stored[ audio ].volume - volumeInterval < 0 ) this.audio.stored[ audio ].volume = 0
                            else this.audio.stored[ audio ].volume -= volumeInterval
                        }

                        if ( this.audio.stored[ audio ].volume <= 0 ) {
                            this.audio.stored[ audio ].volume = 0

                            this.clear.repeater( this.audio.stored[ audio ].gearz.transitions.end[ 0 ] )
                        }
                    }, 0.1 )
                }

                return {
                    inward: inward,
                    out: out,
                }
            },
            add: {
                single: ( name, url ) => this.audio.stored[ name ] = new Audio( url ),
                multi: audioArray => audioArray.forEach( audio => this.audio.stored[ audio[ 0 ] ] = new Audio( audio[ 1 ] ) ),
            },
            set: audio => {
                const volume = v => {
                    if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].volume = v
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                const loop = l => {
                    if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].loop = l
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                const currentTime = t => {
                    if ( this.audio.stored[ audio ] ) this.audio.stored[ audio ].currentTime = t
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                return {
                    volume: volume,
                    loop: loop,
                    currentTime: currentTime,
                }
            },
            get: audio => {
                const volume = () => {
                    if ( this.audio.stored[ audio ] ) return this.audio.stored[ audio ].volume
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                const loop = () => {
                    if ( this.audio.stored[ audio ] ) return this.audio.stored[ audio ].loop
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                const currentTime = () => {
                    if ( this.audio.stored[ audio ] ) return this.audio.stored[ audio ].currentTime
                    else this.log( `"${ audio }" was not found.` ).error()
                }

                return {
                    volume: volume,
                    loop: loop,
                    currentTime: currentTime,
                }
            }
        }
        
        this.operations = {
            create: {
                id: length => {
                    const _length = length ? length : 11

                    let result = ''

                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

                    for ( let i = 0; i < _length; i++ ) result += characters.charAt( Math.floor( Math.random() * characters.length) )

                    return result
                },
            },
            parse: item => {
                try {
                    return JSON.parse( item )
                } catch ( e ) {
                    this.log( 'Could not parse item' ).error()
                }
            },
            stringify: item => {
                try {
                    return JSON.stringify( item )
                } catch ( e ) {
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

        /* manage cursors */
        this.cursor = {
            previous: new Array(),
            current: new Array(),
            directory: [ 'images/cursors/', false ], // directory, isGithubImage
            types: {
                /* name: image, useDirectory */ 
                'normal': [ 'normal.png', true ],
                'sketch collar': [ 'sketch_collar.png', true ]
            },
            show: ( element, isId ) => {
                const current = this.cursor.current, _isId = isId ? isId : false

                let _element = element ? element : 'body'
                
                if ( _element == 'body' ) _element = document.body
                else {
                    if ( _isId ) _element = document.getElementById( _element )
                }

                if ( current.length > 0 ) _element.style.cursor = `url( ${ current[ 0 ] } ) ${ current[ 1 ] } ${ current[ 2 ] }, auto`
            },
            hide: ( element, isId ) => {
                const _isId = isId ? isId : false

                let _element = element ? element : 'body'

                if ( _element == 'body' ) _element = document.body
                else {
                    if ( _isId ) _element = document.getElementById( _element )
                }

                _element.style.cursor = 'none'
            },
            set: ( name, xOffset, yOffset, element, isId ) => {
                const _name = name ? name : 'normal'
                const _xOffset = xOffset ? xOffset : 0      
                const _yOffset = yOffset ? yOffset : 0
                const _isId = isId ? isId : false

                let _element = element ? element : 'body', url

                if ( _element == 'body' ) _element = document.body
                else {
                    if ( _isId ) _element = document.getElementById( _element )
                }

                if ( _name in this.cursor.types ) {
                    if ( this.cursor.types[ _name ][ 1 ] ) {
                        if ( this.cursor.directory[ 1 ] ) url = `${ this.cursor.directory[ 0 ] + this.cursor.types[ _name ][ 0 ] }?raw=true`
                        else url = this.cursor.directory[ 0 ] + this.cursor.types[ _name ][ 0 ]
                    } else url = this.cursor.types[ _name ][ 0 ]
                } else this.log( `Couldn't find a cursor stored in the engine with the name "${ _name }"` ).error()

                _element.style.cursor = `url( ${ url } ) ${ _xOffset } ${ _yOffset }, auto`

                if ( this.cursor.current.length > 0 ) this.cursor.previous = this.cursor.current

                this.cursor.current = new Array( url, _xOffset, _yOffset )

                return {
                    add: this.cursor.add
                }
            },
            add: ( name, image, useDirectory ) => {
                const _name = name ? name : `cursor.${ this.operations.create.id() }`
                const _image = image ? image : 'normal.png'

                let _useDirectory = useDirectory ? useDirectory : false

                if ( _name in this.cursor.types == false ) {
                    if ( typeof _useDirectory != 'boolean' ) {
                        _useDirectory = false

                        this.log( `Your input for the "useDirectory" argument was not a boolean. As a result it was defaulted to "true".` ).error()
                    }

                    this.cursor.types[ _name ] = new Array( _image, _useDirectory )
                } else this.log( `There is already a cursor already stored in the engine with the name "${ _name }". Use the "change" method to change it's properties.` ).error()

                return {
                    add: this.cursor.add,
                    set: ( xOffset, yOffset, element, isId ) => {
                        const _xOffset = xOffset ? xOffset : 0
                        const _yOffset = yOffset ? yOffset : 0
                        const _isId = isId ? isId : false
        
                        let _element = element ? element : 'body', url
        
                        if ( _element == 'body' ) _element = document.body
                        else {
                            if ( _isId ) _element = document.getElementById( _element )
                        }
        
                        if ( _name in this.cursor.types ) {
                            if ( this.cursor.types[ _name ][ 1 ] ) {
                                if ( this.cursor.directory[ 1 ] ) url = `${ this.cursor.directory[ 0 ] + this.cursor.types[ _name ][ 0 ] }?raw=true`
                                else url = this.cursor.directory[ 0 ] + this.cursor.types[ _name ][ 0 ]
                            } else url = this.cursor.types[ _name ][ 0 ]
                        } else this.log( `Couldn't find a cursor stored in the engine with the name "${ _name }"` ).error()
        
                        _element.style.cursor = `url( ${ url } ) ${ _xOffset } ${ _yOffset }, auto`
                    }
                }
            }
        } 

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
                                <dropdown-option id="${ element }-option-${ value[ 1 ] }" label="${ value[ 0 ] }" parent="${ element }" val="${ value[ 1 ] }" style="position: absolute; left: 0; top: ${ topOffset + presets.parent.unit }; width: ${ presets.content.v.w }; height: ${ presets.content.v.h + presets.parent.unit }; background-color: ${ presets.content.v.v[ variation ] }; padding: ${ presets.content.v.p + presets.parent.unit }; box-shadow: ${ presets.content.v.sh }; font-family: ${ presets.content.v.f }; font-size: ${ presets.content.v.s + presets.parent.unit }; font-weight: ${ presets.content.v.we }; text-align: ${ presets.content.v.a }; color: ${ presets.content.v.c }; transition: ${ presets.content.v.t }; z-index: 12;" class="dropdown dropdown-option">${ value[ 0 ] }</dropdown-option>
                            ` )
                                
                            topOffset += presets.content.v.h + ( presets.content.v.p * 2 )
                            variation++
        
                            if ( variation == presets.content.v.v.length ) variation = 0
                        } )

                        presets.values = args

                        if ( presets.content.overflow != 'auto' ) presets.content.maxHeight = ( presets.content.v.h + ( presets.content.v.p * 2 ) ) * presets.values.length
                        else presets.content.overflow = 'auto'

                        this.element( `${ element }-content` ).set.height( presets.content.maxHeight, presets.parent.unit )
                        this.element( `${ element }-content` ).set.height( 0, presets.parent.unit )
                    },
                }

                return {
                    values: values
                }
            } else this.log( 'This element is not a dropdown' ).error()
        }

        this.element = element => {
            const _element = document.getElementById( element )
            const render = content => {
                _element.innerHTML += content

                const custom = options => {
                    if ( options ) {
                        options.forEach( option => {
                            if ( option[ 1 ].display ) document.getElementById( option[ 0 ] ).style.display = 'inline-block'
                            else document.getElementById( option[ 0 ] ).style.display = 'none'
                        } )
                    }
                }

                return {
                    custom: custom
                }
            }
            const retrieve = {
                id: () => { return _element.id },
            }
            const remove = {
                listener: ( eventNames, listener ) => {
                    const events = eventNames.split( ' ' )

                    events.forEach( event => { _element.removeEventListener( event, listener, false ) } )
                },
                cl: cl => _element.classList.remove( cl )
            }
            const add = {
                listener: ( eventNames, listener ) => {
                    let events = eventNames.split( ' ' )

                    events.forEach( event => _element.addEventListener( event, listener, false ) )
                },
                child: childElement => _element.appendChild( childElement ),
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
                                    v: lAttr.tV ? lAttr.tV : '0', // text value
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
                            <dropdown-label id="${ id }-label" parent="${ id }" val="" style="position: absolute; left: 0; top: 0; width: calc( 100% - ${ ( presets.parent.height + ( presets.label.padding * 2 ) ) + presets.parent.unit } ); height: ( 100% - ${ ( presets.label.padding * 2 ) + presets.parent.unit } ); background-color: transparent; box-shadow: none; font-family: ${ presets.label.t.f }; font-size: ${ presets.label.t.s + presets.parent.unit }; font-weight: ${ presets.label.t.w }; text-align: ${ presets.label.t.a };  color: ${ presets.label.t.c }; padding: ${ presets.label.padding + presets.parent.unit }; padding-left: ${ ( presets.label.padding * 2 ) + presets.parent.unit }; z-index: 10;" class="dropdown">${ presets.label.t.i }</dropdown-label>
                            <dropdown-arrow id="${ id }-arrow" parent="${ id }" style="position: absolute; right: 0; top: 0; margin: 0; width: ${ presets.parent.height + presets.parent.unit }; height: ${ presets.parent.height + presets.parent.unit };background-size: ${ presets.arrow.i.s }%; background-image: url( ${ presets.arrow.i.l } ); background-position: center; background-repeat: no-repeat; transform: rotate( ${ presets.arrow.r.f }deg ); transition: ${ presets.arrow.transition };" class="dropdown" z-index: 10;></dropdown-arrow>
                            <dropdown-content id="${ id }-content" parent="${ id }" style="position: absolute; left: 0; top: 0; width: 100%; height: 0${ presets.parent.unit }; background-color: ${ presets.content.bgColor }; border-radius: ${ presets.content.roundness }; box-shadow: ${ presets.content.shadow }; margin-top: ${ presets.parent.height + presets.parent.unit }; transition: ${ presets.content.transition }; overflow-x: hidden; overflow-y: ${ presets.content.overflow }; z-index: 11;" class="dropdown"></dropdown-content>
                        </dropdown>
                    ` ).custom()

                    let topOffset = 0
                    let variation = 0

                    presets.values.forEach( ( value, index ) => {
                        this.element( `${ id }-content` ).render( `
                            <dropdown-option id="${ id }-option-${ value[ 1 ] }" label="${ value[ 0 ] }" parent="${ id }" val="${ value[ 1 ] }" style="position: absolute; left: 0; top: ${ topOffset + presets.parent.unit }; width: ${ presets.content.v.w }; height: ${ presets.content.v.h + presets.parent.unit }; background-color: ${ presets.content.v.v[ variation ] }; padding: ${ presets.content.v.p + presets.parent.unit }; box-shadow: ${ presets.content.v.sh }; font-family: ${ presets.content.v.f }; font-size: ${ presets.content.v.s + presets.parent.unit }; font-weight: ${ presets.content.v.we }; text-align: ${ presets.content.v.a }; color: ${ presets.content.v.c }; transition: ${ presets.content.v.t }; z-index: 12;" class="dropdown dropdown-option">${ value[ 0 ] }</dropdown-option>
                        ` )
                        
                        topOffset += presets.content.v.h + ( presets.content.v.p * 2 )
                        variation++

                        if ( variation == presets.content.v.v.length ) variation = 0
                    } )

                    this.elements.dropdowns[ id ] = presets

                    if ( actions ) {
                        for ( const mEvent in actions ) this.events.add( 'document', mEvent, mEvent[ 0 ], mEvent[ 1 ] )
                    }
                    
                        this.events.add( 'document', 'mouseover', 'dropdown-management', target => {
                            if ( target.classList.contains( 'dropdown' ) ) {
                                const parent = target.getAttribute( 'parent' )

                                _this.element( parent ).set.boxShadow( this.elements.dropdowns[ parent ].parent.h.s )
                                _this.element( parent ).set.roundness( this.elements.dropdowns[ parent ].parent.h.r )
                                _this.element( `${ parent }-arrow` ).set.transform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.t }deg )` )
                                _this.element( `${ parent }-content` ).set.height( this.elements.dropdowns[ parent ].content.maxHeight, this.elements.dropdowns[ parent ].parent.unit )

                                if ( target.classList.contains( 'dropdown-option' ) ) {
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.boxShadow( this.elements.dropdowns[ parent ].content.h.sh )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.textShadow( this.elements.dropdowns[ parent ].content.h.shT )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.textColor( this.elements.dropdowns[ parent ].content.h.c )
                                }
                            }
                        } )

                        this.events.add( 'document', 'mouseout', 'dropdown-management', target => {
                            if ( target.classList.contains( 'dropdown' ) ) {
                                const parent = target.getAttribute( 'parent' )

                                _this.element( parent ).set.boxShadow( this.elements.dropdowns[ parent ].parent.shadow )
                                _this.element( parent ).set.roundness( this.elements.dropdowns[ parent ].parent.roundness )
                                _this.element( `${ parent }-arrow` ).set.transform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.f }deg )` )
                                _this.element( `${ parent }-content` ).set.height( 0, this.elements.dropdowns[ parent ].parent.unit )

                                if ( target.classList.contains( 'dropdown-option' ) ) {
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.boxShadow( this.elements.dropdowns[ parent ].content.v.sh )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.textShadow( this.elements.dropdowns[ parent ].content.v.shT )
                                    _this.element( `${ parent }-option-${ target.getAttribute( 'val' ) }` ).set.textColor( this.elements.dropdowns[ parent ].content.v.c )
                                }
                            }
                        } )

                        this.events.add( 'document', 'click', 'dropdown-option-management', target => {
                            if ( target.classList.contains( 'dropdown-option' ) ) {
                                const parent = target.getAttribute( 'parent' )
                                
                                _this.element( parent ).set.boxShadow( this.elements.dropdowns[ parent ].parent.shadow )
                                _this.element( parent ).set.roundness( this.elements.dropdowns[ parent ].parent.roundness )
                                _this.element( `${ parent }-label` ).set.text( target.getAttribute( 'label' ) )
                                _this.element( `${ parent }-label` ).set.attr( 'val', target.getAttribute( 'val' ) )
                                _this.element( `${ parent }-arrow` ).set.transform( `rotate( ${ this.elements.dropdowns[ parent ].arrow.r.f }deg )` )
                                _this.element( `${ parent }-content` ).set.height( 0, this.elements.dropdowns[ parent ].parent.unit )
                            }
                        } )
                },
                cl: cl => _element.classList.add( cl )
            }

            const check = {
                all: ( value, func, waitTime ) => _element.querySelectorAll( value ).forEach( () => _this.wait( func, waitTime ) ),
                attr: attrib => { return _element.hasAttribute( attrib ) },
                exists: () => { return document.getElementById( element ) },
                isShowing: () => {
                    if ( _element.style.display == 'inline-block' ) return true
                    else if ( _element.style.display == 'none' ) return false
                },
                cl: {
                    includes: cl => { return _element.classList.contains( cl ) },
                },
            }

            const once = {
                showing: ( func, interval ) => {
                    const _interval = interval ? interval : 0.5
    
                    this.wait( () => {
                        if ( this.element( element ).check.isShowing() ) {
                            this.log( `${ element } is now showing` ).reg()
                        
                            this.wait( func, 0 )
                        } else this.element( element ).once.showing( func, _interval )
                    }, _interval )
                },
                exists: ( func, interval ) => {
                    const _interval = interval ? interval : 0.5
    
                    this.wait( () => {
                        if ( this.element( element ).check.exists() ) {
                            this.log( `${ element } is now showing` ).reg()
                        
                            this.wait( func, 0 )
                        } else this.element( element ).once.exists( func, _interval )
                    }, _interval )
                },
            }

            const set = {
                id: id => _element.id = id,
                cl: cl => _element.className = cl,
                style: content => _element.setAttribute( 'style', content ),
                width: ( width, unit ) => _element.style.width = width + unit,
                height: ( height, unit ) => _element.style.height = height + unit,
                marginLeft: ( margin, unit ) => _element.style.marginLeft = margin + unit,
                marginRight: ( margin, unit ) => _element.style.marginRight = margin + unit,
                marginTop: ( margin, unit ) => _element.style.marginTop = margin + unit,
                marginBottom: ( margin, unit ) => _element.style.marginBottom = margin + unit,
                transform: transform => _element.style.transform = transform,
                filter: filter => _element.style.filter = filter,
                transition: transition => _element.style.transition = transition,
                pointerEvents: event => _element.style.pointerEvents = event,
                roundness: roundness => _element.style.borderRadius = roundness,
                borderRadius: roundness => _element.style.borderRadius = roundness,
                text: string => _element.innerHTML = string,
                innerHTML: string => _element.innerHTML = string,
                value: value => _element.value = value,
                zIndex: value => _element.style.zIndex = `${ value }`,
                backgroundImage: link => _element.style.backgroundImage = `url(${ link })`,
                textColor: color => _element.style.color = color,
                backgroundSize: size => _element.style.backgroundSize = size,
                backgroundColor: color => _element.style.backgroundColor = color,
                background: background => _element.style.background = background,
                fill: fill => _element.style.fill = fill,
                borderColor: color => _element.style.borderColor = color,
                opacity: opacity => _element.style.opacity = `${ opacity * 100 }%`,
                animation: animation => _element.style.animation = animation,
                textShadow: shadow => _element.style.textShadow = shadow,
                boxShadow: shadows => _element.style.boxShadow = shadows,
                attr: ( attr, value ) => _element.setAttribute( attr, value ),
            }

            const get = {
                attr: attr => _element.getAttribute( attr ),
                filter: () => { return _element.style.filter },
                offsetTop: () => { return _element.offsetTop },
                offsetLeft: () => { return _element.offsetLeft },
                transform: () => { return _element.style.transform },
                value: () => { return _element.value },
                valueLength: () => {  return _element.value.length },
                text: () => { return _element.innerHTML },
                innerHTML: () => { return _element.innerHTML },
            }

            const move = {
                absolute: ( left, right, top, bottom, unit, transition ) => {
                    const _transition = { seconds: 0.15, type: 'ease' }

                    if ( transition ) {
                        _transition.seconds = transition.seconds ? transition.seconds : 0.15
                        _transition.type = transition.type ? transition.type : 'ease'
                    }

                    this.element( element ).set.marginLeft( left + unit )
                    this.element( element ).set.marginRight( right + unit )
                    this.element( element ).set.marginTop( top + unit )
                    this.element( element ).set.marginBottom( bottom + unit )
                    this.element( element ).set.transition( `${ _transition.seconds }s ${ _transition.type }` )
                },
            }

            const dispose = () => _element.remove()
            const clear = () => _element.innerHTML = ''

            const hide = time => {
                const _time = time ? time : 0

                this.wait( () => _element.style.display = 'none', _time )
            }

            const show = ( type, time ) => {
                const _type = type ? type : 'inline-block'
                const _time = time ? time : 0

                this.wait( () => {
                    if ( _type != 'inline-block' || _type != 'i-b' ) {
                        if ( ( _type != 'none' || _type != 'n' ) ) {
                            _element.style.display = _type
                        } else _element.style.display = 'none'
                    } else _element.style.display = 'inline-block'
                }, _time )
            }

            const drag = enabled => {
                const _enabled = enabled ? enabled : false

                if ( typeof _enabled == 'boolean' ) {
                    const position = {
                        new: { x: 0, y: 0 },
                        old: { x: 0, y: 0 },
                    }
    
                    const events = {
                        drag: {
                            stop: () => {
                                /* stop moving when mouse button is released */
                                document.onmouseup = null
                                document.onmousemove = null
                            },
                            track: e => {
                                e = e || window.event
                                e.preventDefault()
    
                                /* calculate the new cursor position */
                                position.new.x = position.old.x - e.clientX
                                position.new.y = position.old.y - e.clientY
                                position.old.x = e.clientX
                                position.old.y = e.clientY
    
                                /* set new position of element */ 
                                this.element( element ).set.marginTop( this.element( element ).get.offsetTop() - position.new.y, this.units.px )
                                this.element( element ).set.marginLeft( this.element( element ).get.offsetLeft() - position.new.x, this.units.px )
                            },
                        },
                        mousedown: e => {
                            e = e || window.event
                            e.preventDefault()
    
                            /* calculate the new cursor position at start-up */
                            position.old.x = e.clientX
                            position.old.y = e.clientY
    
                            document.onmouseup = () => events.drag.stop() // stop dragging when mouse is not being held anymore
                            document.onmousemove = () => events.drag.track() // call when cursor moves
                        },
                    }

                    if ( _enabled ) {
                        if ( this.element( `${ element }-header` ).check.exists() ) this.element( `${ element }-header` ).add.listener( 'mousedown', e => events.mousedown( e ) )
                        else this.element( element ).add.listener( 'mousedown', e => events.mousedown( e ) )
                    } else {
                        if ( this.element( `${ element }-header` ).check.exists() ) this.element( `${ element }-header` ).remove.listener( 'mousedown', e => events.mousedown( e ) )
                        else this.element( element ).remove.listener( 'mousedown', e => events.mousedown( e ) )
                    }
                } else this.log( 'The argument passed for dragging is not a boolean' ).error()
            }
            
            return {
                render: render,
                dispose: dispose,
                clear: clear,
                hide: hide,
                show: show,
                drag: drag,
                set: set,
                get: get,
                add: add,
                remove: remove,
                retrieve: retrieve,
                once: once,
                check: check,
                move: move,
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

        this.preloadImages = ( array, options ) => {
            const presets = {}

            if ( options ) {
                presets.prefix = options.prefix ? options.prefix : String()
                presets.suffix = options.suffix ? options.suffix : String()
            } else {
                presets.prefix = String()
                presets.suffix = String()
            }

            if ( !this.preloadedImages ) this.preloadedImages = new Array()

            const list = this.preloadedImages

            array.forEach( image => {
                const img = new Image()

                img.onload = () => {   
                    const imgIndex = list.indexOf( this )

                    if ( imgIndex != -1 ) list.splice( imgIndex, 1 )
                }

                list.push( img )
                img.src = presets.prefix + image + presets.suffix
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

        this.createLogger = header => {
            return content => {
                const _header = header ? header: '[ GearZ ]'

                const reg = () => console.log( `${ _header } ${ content }` )
                const error = () => console.error( `${ _header } <!> ${ content }` )

                return {
                    reg: reg,
                    error: error,
                }
            }
        }

        /* Three.js stuff */
        if ( this.three ) {
            this.log( 'three.js found' ).reg()

            const stored = { meshes: {} }

            if ( loadStored3DData ) {
                this.log( '←------ Loading 3D Data ------→' ).reg()

                if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                    const localMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                    const localPositions = this.operations.parse( localStorage.getItem( 'gearz.meshes.positions' ) )

                    for ( const m in localMeshes ) {
                        localMeshes[ m ] = new THREE.ObjectLoader().parse( localMeshes[ m ] )

                        if ( m in localPositions ) localMeshes[ m ].position.set( localPositions[ m ].x, localPositions[ m ].y, localPositions[ m ].z )
                    }

                    stored.meshes = localMeshes

                    this.log( `${ Object.keys( localMeshes ).length } loaded from local storage` ).reg()
                } else this.log( 'No meshes have been stored locally' ).reg()
            }

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
                create: {
                    world: () => {
                        return {
                            /* properties */ 
                            scene: new this.three.Scene(),
                            camera: new this.three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),
                            renderer: new this.three.WebGLRenderer( { antialias: true, alpha: true } ),

                            /* methods */
                            init: function ( orbitControls ) {

                                /* renderer */
                                this.renderer.setSize( window.innerWidth, window.innerHeight )
                                this.renderer.outputEncoding = _this.three.GammaEncoding
                                this.renderer.gammaFactor = 2
                                this.renderer.shadowMap.enabled = true
                                this.renderer.domElement.setAttribute( 'id', 'world' )
			                    document.body.appendChild( this.renderer.domElement )

                                /* camera */
                                this.camera.position.set( 10, 10, 10 )

                                /* lights */ 
                                this.scene.lights = {
                                    hemisphere: new _this.three.HemisphereLight( 0xffffff, 0x080820, 1 ),
                                    directional: {
                                        main: new _this.three.DirectionalLight( 0xffffff, 1 )
                                    },
                                }


                                this.scene.lights.hemisphere.position.set( 50, 100, 50 )

                                _this.threeJS.mesh.add( this.scene.lights.hemisphere, false ).to( this.scene, false )

                                /* helpers */
                                this.scene.helpers = {
                                    grid: _this.threeJS.mesh.create.helper( this.scene, false ).grid( 20, 20, 0x000000 ),
                                }

                                _this.threeJS.mesh.add( this.scene.helpers.grid, false ).to( this.scene, false )

                                /* add controls */ 
                                this.scene.controls = {
                                    orbit: orbitControls == true ? new _this.three.OrbitControls( this.camera, this.renderer.domElement ) : null,
                                }
                            },
                            resize: function () {
                                if ( this.camera ) {
                                    this.camera.aspect = window.innerWidth / window.innerHeight
                                    this.camera.updateProjectionMatrix()
                                }

                                if ( this.renderer ) this.renderer.setSize( window.innerWidth, window.innerHeight )
                            },
                            render: function () {
                                if ( this.scene.controls ) {
                                    if ( this.scene.controls.orbit != null ) this.scene.controls.orbit.update()
                                }

                                this.renderer.render( this.scene, this.camera )
                            },
                        }
                    },
                },
                mesh: {
                    stored: stored.meshes,
                    helpers: {
                        grids: new Array(),
                    },
                    default: {
                        geometry: new this.three.BoxGeometry( 1, 1, 1 ),
                        material: new this.three.MeshPhongMaterial( { color: 0xff00ff, flatShading: true } ),
                    },
                    set: ( mesh, isArray ) => {
                        return {
                            shadows: ( cast, receive ) => {
                                if ( isArray ) {
                                    mesh.forEach( m => {
                                        m.castShadow = cast ? cast : false
                                        m.receiveShadow = receive ? receive : false
                                    } )
                                } else {
                                    mesh.castShadow = cast ? cast : false
                                    mesh.receiveShadow = receive ? receive : false
                                }
                            },
                        }
                    },
                    create: {
                        helper: ( object, isArray ) => {
                            return {
                                grid: ( size, divisions, centerColor, gridColor ) => {
                                    const _size = size ? size : 10
                                    const _divisions = divisions ? divisions : 10
                                    const _centerColor = centerColor ? centerColor : 0x444444
                                    const _gridColor = gridColor ? gridColor : 0x888888

                                    if ( isArray ) {
                                        object.forEach( o => {
                                            const helper = new THREE.GridHelper( _size, _divisions, _centerColor, _gridColor )

                                            if ( o.type == 'Scene' ) helper.position.set( 0, 0, 0 )
                                            else if ( o.type == 'Mesh' ) helper.position = o.position

                                            o.add( helper )

                                            this.threeJS.mesh.helpers.grids.push( helper )
                                        } )
                                    } else {
                                        const helper = new THREE.GridHelper( _size, _divisions, _centerColor, _gridColor )

                                        if ( object.type == 'Scene' ) helper.position.set( 0, 0, 0 )
                                        else if ( object.type == 'Mesh' ) helper.position = object.position

                                        return helper
                                    }
                                },
                            }
                        },
                        regular: ( options ) => {
                            const presets = {
                                name: `mesh.${ this.operations.create.id( 11 ) }`,
                                geometry: this.threeJS.mesh.default.geometry,
                                material: this.threeJS.mesh.default.material,
                            }

                            if ( options ) {
                                presets.name = options.name ? options.name : `mesh.${ this.operations.create.id( 11 ) }`
                                presets.geometry = options.geometry ? options.geometry : this.threeJS.mesh.default.geometry
                                presets.material = options.material ? options.material : this.threeJS.mesh.default.material
                            }

                            const mesh = new this.three.Mesh( presets.geometry, presets.material )
                            mesh.name = presets.name
                            
                            return mesh
                        },
                        instanced: ( options ) => {
                            const presets = {
                                name: `mesh.${ this.operations.create.id( 11 ) }`,
                                geometry: this.threeJS.mesh.default.geometry,
                                material: this.threeJS.mesh.default.material,
                                count: 1,
                            }

                            if ( options ) {
                                presets.name = options.name ? options.name : `mesh.${ this.operations.create.id( 11 ) }`
                                presets.geometry = options.geometry ? options.geometry : this.threeJS.mesh.default.geometry
                                presets.material = options.material ? options.material : this.threeJS.mesh.default.material
                                presets.count = options.count ? options.count : 1
                            }

                            const mesh = new this.three.InstancedMesh( presets.geometry, presets.material, presets.count )
                            mesh.name = presets.name
                            
                            return mesh
                        },
                    },
                    addStoredToLocal: ( clear, keepPositions ) => {
                        if ( clear ) {
                            const localMeshes = {}, localPositions = {}

                            localStorage.setItem( 'gearz.meshes', this.operations.stringify( localMeshes ) )
                            localStorage.setItem( 'gearz.meshes.positions', this.operations.stringify( localPositions ) )
                        }
                        
                        let newLocalMeshes = {}, newLocalPositions = {}

                        if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                            newLocalMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                            newLocalPositions = this.operations.parse( localStorage.getItem( 'gearz.meshes.positions' ) )

                            for ( const m in newLocalMeshes ) newLocalMeshes[ m ] = new THREE.ObjectLoader().parse( newLocalMeshes[ m ] )
                        }
                        
                        for ( const m in this.threeJS.mesh.stored ) {
                            newLocalMeshes[ m ] = this.threeJS.mesh.stored[ m ]

                            if ( keepPositions ) {
                                newLocalPositions[ m ] = {
                                    x: newLocalMeshes[ m ].position.x,
                                    y: newLocalMeshes[ m ].position.y,
                                    z: newLocalMeshes[ m ].position.z,
                                }
                            }
                        }

                        localStorage.setItem( 'gearz.meshes', this.operations.stringify( newLocalMeshes ) )
                        localStorage.setItem( 'gearz.meshes.positions', this.operations.stringify( newLocalPositions ) )
                    },
                    add: ( mesh, isArray ) => {
                        const store = whereToStore => {
                            if ( isArray ) mesh.forEach( m => this.threeJS.mesh.store( m, whereToStore ) )
                            else this.threeJS.mesh.store( mesh, whereToStore )

                            return {
                                to: to,
                            }
                        }

                        const to = ( object, isName ) => {
                            if ( !isName ) {
                                if ( isArray ) mesh.forEach( m => object.add( m ) )
                                else object.add( mesh )
                            } else this.threeJS.mesh.stored[ object ].add( mesh )

                            return {
                                store: store,
                            }
                        }
                        
                        return {
                            then: this.then,
                            store: store,
                            to: to,
                        }
                    },
                    exists: ( mesh, where, isName ) => {
                        if ( where == 'local' ) {
                            if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                                const localMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                                
                                if ( isName ) {
                                    if ( localMeshes[ mesh ] != null ) return true
                                    else return false
                                } else {
                                    let name = ''

                                    for ( const m in localMeshes ) {
                                        const parsedMesh = new THREE.ObjectLoader().parse( localMeshes[ m ] )

                                        if ( parsedMesh.uuid == mesh.uuid ) {
                                            name = m

                                            break
                                        }
                                    }

                                    if ( localMeshes[ name ] != null ) return true
                                    else return false
                                }
                            } else this.log( 'No meshes are stored locally' ).reg()
                        }
                    },
                    find: ( mesh, where, isName ) => {
                        if ( where == 'local' ) {
                            if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                                const localMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                                
                                if ( isName ) {
                                    if ( localMeshes[ mesh ] != null ) return new THREE.ObjectLoader().parse( localMeshes[ mesh ] )
                                    else this.log( 'Could not find mesh with this name locally' ).reg()
                                } else {
                                    let name = ''

                                    for ( const m in localMeshes ) {
                                        const parsedMesh = new THREE.ObjectLoader().parse( localMeshes[ m ] )

                                        if ( parsedMesh.uuid == mesh.uuid ) {
                                            name = m

                                            break
                                        }
                                    }

                                    if ( localMeshes[ name ] != null ) return name
                                    else this.log( 'Could not find mesh with these properties locally' ).reg()
                                }
                            } else this.log( 'No meshes are stored locally' ).reg()
                        }
                    },
                    store: ( mesh, whereToStore, options ) => {
                        let storage

                        const presets = {
                            storage: whereToStore ? whereToStore : 'engine',
                            name: mesh.name.length > 0 ? mesh.name : `mesh.${ this.operations.create.id( 11 ) }`
                        }
                  
                        if ( options ) {
                            const name = presets.name

                            presets.name = options.name ? options.name : name
                        }

                        if ( presets.storage == 'engine' ) {
                            // mesh.storage = [ 'engine' ]

                            this.threeJS.mesh.stored[ presets.name ] = mesh
                        } else if ( presets.storage == 'local' ) {
                            // mesh.storage = [ 'local' ]

                            if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                                const localMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                                localMeshes[ presets.name ] = mesh

                                localStorage.setItem( 'gearz.meshes', this.operations.stringify( localMeshes ) )
                            } else {
                                const newLocalMeshes = {}
                                newLocalMeshes[ presets.name ]

                                localStorage.setItem( 'gearz.meshes', this.operations.stringify( newLocalMeshes ) )
                            }
                        } else if ( presets.storage == 'engine local' || presets.storage == 'local engine' ) {
                            // mesh.storage = [ 'engine', 'local' ]

                            this.threeJS.mesh.stored[ presets.name ] = mesh

                            if ( localStorage.getItem( 'gearz.meshes' ) != null ) {
                                const localMeshes = this.operations.parse( localStorage.getItem( 'gearz.meshes' ) )
                                localMeshes[ presets.name ] = mesh

                                localStorage.setItem( 'gearz.meshes', this.operations.stringify( localMeshes ) )
                            } else {
                                const newLocalMeshes = {}
                                newLocalMeshes[ presets.name ]

                                localStorage.setItem( 'gearz.meshes', this.operations.stringify( newLocalMeshes ) )
                            }
                        }
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