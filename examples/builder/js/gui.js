( function () {
    /*
        This is the GUI for the buider example. A modified version of this interface
        and the builder will be available in Civilia. Please understand that these 
        things are made by be and take a long time to create.
    
        @author Nikolas Karinja
    */ 

    class Events {
        constructor () {
            this.panning = false
            this.rotating = false
        }

        activate ( eventName, deactivateAll ) {
            const _eventName = eventName ? eventName : null
            const _deactivateAll = deactivateAll ? true : false
            const events = new Array()

            if ( _deactivateAll ) this.deactivateAll()

            for ( const ev in this ) events.push( ev )

            if ( events.includes( _eventName ) ) this[ _eventName ] = true
            else builder.gui.log( `Couldn't find an event with the name of "${ _eventName }"`, 1 )
        }

        deactivate ( eventName ) {
            const _eventName = eventName ? eventName : null
            const events = new Array()

            for ( const ev in this ) events.push( ev )

            if ( events.includes( _eventName ) ) this[ _eventName ] = false
            else builder.gui.log( `Couldn't find an event with the name of "${ _eventName }"`, 1 )
        }

        deactivateAll () {
            for ( const ev in this ) this[ ev ] = false
        }
    }

    class GUI {
        constructor ( gearz ) {
            this.logger = gearz ? gearz.createLogger( '[ Logic ]' ) : null
            this.objectSelected = null
            this.mouseEvent = null

            this.settings = {
                translationSnap: [ true, 1 ],
                rotationSnap: [ true, 15 ],
                scaleSnap: [ true, 1 ],
            }

            this.transformations = {
                translate: true,
                rotate: false,
                scale: false,
            }

            this.interfaces = {
                selected: 'world',
                checkNumber: number => { return number.toString().split( '.' )[ number.toString().split( '.' )[ 1 ] ? 1 : 0 ].length > 4 ? number.toFixed( 4 ) : number },
                transformations: {
                    update: () => {},
                },
                scene: {
                    rotate: e => {
                        gearz.cursor.set( 'rotate.32', 16, 16 )

                        gearz.element( 'gui' ).set.pointerEvents( 'none' )
                        gearz.element( 'scene-rotate' ).set.animation( 'active-event 1s infinite' )

                        world.scene.controls.orbit.onMouseDown( e, 'rotate' )
                        world.scene.events.activate( 'rotating' )
                    },
                    pan: e => {
                        gearz.cursor.set( 'pan.32', 16, 16 )

                        gearz.element( 'gui' ).set.pointerEvents( 'none' )
                        gearz.element( 'scene-pan' ).set.animation( 'active-event 1s infinite' )

                        world.scene.controls.orbit.onMouseDown( e, 'pan' )
                        world.scene.events.activate( 'panning' )
                    },
                    releaseControls: () => {
                        if ( this.mouseEvent != null ) world.scene.controls.orbit.onMouseUp( this.mouseEvent )

                        gearz.cursor.set()

                        gearz.element( 'gui' ).set.pointerEvents( 'auto' )

                        world.scene.events.deactivateAll()

                        gearz.element( 'scene-rotate' ).set.animation( 'none' )
                        gearz.element( 'scene-pan' ).set.animation( 'none' )
                    } 
                },
                'object-transforms': {
                    update: () => {
                        if ( this.objectSelected != null ) {
                            const object = builder.objects[ this.objectSelected ]

                            gearz.element( 'object-transforms-position-x' ).set.value( this.interfaces.checkNumber( object.position.x ) )
                            gearz.element( 'object-transforms-position-y' ).set.value( this.interfaces.checkNumber( object.position.y ) )
                            gearz.element( 'object-transforms-position-z' ).set.value( this.interfaces.checkNumber( object.position.z ) )

                            gearz.element( 'object-transforms-rotation-x' ).set.value( `${ this.interfaces.checkNumber( gearz.operations.convert( 'rad', object.rotation.x ).to.deg() ) } deg` )
                            gearz.element( 'object-transforms-rotation-y' ).set.value( `${ this.interfaces.checkNumber( gearz.operations.convert( 'rad', object.rotation.y ).to.deg() ) } deg` )
                            gearz.element( 'object-transforms-rotation-z' ).set.value( `${ this.interfaces.checkNumber( gearz.operations.convert( 'rad', object.rotation.z ).to.deg() ) } deg` )

                            gearz.element( 'object-transforms-scale-x' ).set.value( this.interfaces.checkNumber( object.scale.x ) )
                            gearz.element( 'object-transforms-scale-y' ).set.value( this.interfaces.checkNumber( object.scale.y ) )
                            gearz.element( 'object-transforms-scale-z' ).set.value( this.interfaces.checkNumber( object.scale.z ) )
                        }
                    },
                }
            }

            this.set = {
                transformation: type => {
                    const _type = type ? type : 'translate'

                    if ( _type == 'translate' || _type == 'rotate' || _type == 'scale' ) {
                        for ( const t in this.transformations ) this.transformations[ t ] = false
                        
                        this.transformations[ _type ] = true

                        builder.controls.transform.setMode( _type )

                        this.interfaces.transformations.update()
                    } else this.log( '( => set.transformation ) Not a type of transformation', 1 )
                }
            }

            this.init = {
                controls: () => {
                    const settings = this.settings,
                    set = this.set,
                    interfaces = this.interfaces

                    world.scene.events = new Events()

                    gearz.preloadImages( [
                        'images/builder/translate_object.128',
                        'images/builder/rotate_object.128',
                        'images/builder/scale_object.128',
                        'images/builder/rotate.128',
                        'images/builder/pan.128'
                    ], { suffix: '.png' } )

                    gearz.element( 'gui-object-transforms' ).drag( true, 'rt' )
                    gearz.element( 'gui-object-transformation' ).drag( true, 'lb' )

                    builder.controls.transform.setTranslationSnap( settings.translationSnap[ 1 ] )
                    builder.controls.transform.setRotationSnap( gearz.operations.convert( 'deg', settings.rotationSnap[ 1 ] ).to.rad() )
                    builder.controls.transform.setScaleSnap( settings.scaleSnap[ 1 ] )

                    g3d.mesh.add( builder.controls.transform, false ).to( world.scene, false )

                    builder.controls.transform.addEventListener( 'dragging-changed', e => {
                        if ( world.scene.controls.orbit ) world.scene.controls.orbit.enabled = ! e.value
                    } )

                    builder.controls.transform.addEventListener( 'change', e => {
                        interfaces[ 'object-transforms' ].update()
                    } )

                    builder.controls.transform.addEventListener( 'change', e => {
                        interfaces[ 'object-transforms' ].update()
                    } )

                    builder.element.add.listener( 'mousemove', e => {
                        builder.mouse.data.x = ( e.clientX / window.innerWidth ) * 2 - 1
	                    builder.mouse.data.y = - ( e.clientY / window.innerHeight ) * 2 + 1

                        builder.mouse.ray.setFromCamera( builder.mouse.data, world.camera )
                    } )

                    builder.element.add.listener( 'click', e => {
                        const intersects = builder.mouse.ray.intersectObjects( builder.objects )

                        if ( intersects.length > 0 ) {
                            intersects.forEach( i => {
                                const object = i.object
    
                                builder.controls.transform.attach( object )

                                let objectIndex = null

                                builder.objects.forEach( ( o, index ) => {
                                    if ( o.name == object.name ) objectIndex = index
                                } )

                                this.objectSelected = objectIndex

                                interfaces[ 'object-transforms' ].update()

                                gearz.element( 'gui-object-transforms' ).show()
                            } )
                        }
                    } )

                    builder.element.add.listener( 'dblclick', e => {
                        const intersects = builder.mouse.ray.intersectObjects( builder.objects )

                        if ( intersects.length > 0 ) {
                        } else {
                            builder.controls.transform.detach()

                            gearz.element( 'gui-object-transforms' ).hide()
                        }
                    } )

                    /* object controls */
                    gearz.element( 'object-transformation-translate' ).add.listener( 'click', () => set.transformation( 'translate' ) ) 
                    gearz.element( 'object-transformation-rotate' ).add.listener( 'click', () => set.transformation( 'rotate' ) ) 
                    gearz.element( 'object-transformation-scale' ).add.listener( 'click', () => set.transformation( 'scale' ) ) 

                    /* scene controls */ 
                    gearz.element( 'scene-rotate' ).add.listener( 'mousedown', e => interfaces.scene.rotate( e ) )
                    gearz.element( 'scene-pan' ).add.listener( 'mousedown', e => interfaces.scene.pan( e ) )

                    /* document events */ 
                    document.addEventListener( 'keyup', interfaces.scene.releaseControls )
                    document.addEventListener( 'mouseup', interfaces.scene.releaseControls )
                    document.addEventListener( 'mousemove', e => this.mouseEvent = e )

                    document.addEventListener( 'keypress', e => {
                        if ( interfaces.selected == 'transformations' || interfaces.selected == 'world' ) {
                            switch ( e.code ) {
                                case 'KeyA':
                                    set.transformation( 'translate' )
                                    break
                                case 'KeyS':
                                    set.transformation( 'rotate' )
                                    break
                                case 'KeyD':
                                    set.transformation( 'scale' )
                                    break
                                case 'KeyQ':
                                    if ( settings.translationSnap[ 0 ] ) {
                                        settings.translationSnap[ 0 ] = false
    
                                        builder.controls.transform.setTranslationSnap( 0 )
                                    } else {
                                        settings.translationSnap[ 0 ] = true
    
                                        builder.controls.transform.setTranslationSnap( settings.translationSnap[ 1 ] )
                                    }

                                    break
                                case 'KeyW':
                                    if ( settings.rotationSnap[ 0 ] ) {
                                        settings.rotationSnap[ 0 ] = false
    
    
                                        builder.controls.transform.setRotationSnap( 0 )
                                    } else {
                                        settings.rotationSnap[ 0 ] = true
    
                                        builder.controls.transform.setRotationSnap( gearz.operations.convert( 'deg', settings.rotationSnap[ 1 ] ).to.rad() )
                                    }

                                    break
                                case 'KeyE':
                                    if ( settings.scaleSnap[ 0 ] ) {
                                        settings.scaleSnap[ 0 ] = false
    
                                        builder.controls.transform.setScaleSnap( 0 )
                                    } else {
                                        settings.scaleSnap[ 0 ] = true
    
                                        builder.controls.transform.setScaleSnap( settings.scaleSnap[ 1 ] )
                                    }

                                    break
                                case 'Space':
                                    builder.controls.transform.detach()
                                    break
                            }
                        }
                    } )

                    document.addEventListener( 'keydown', e => {
                        if ( interfaces.selected == 'transformations' || interfaces.selected == 'world' ) {
                            switch ( e.code ) {
                                case 'KeyZ':
                                    if ( this.mouseEvent != null ) interfaces.scene.pan( this.mouseEvent )
                                    break
                                case 'KeyX':
                                    if ( this.mouseEvent != null ) interfaces.scene.rotate( this.mouseEvent )
                                    break
                            }
                        }
                    } )

                    document.addEventListener( 'contextmenu', e => {
                        e.preventDefault()
                    } )

                    gearz.element( 'gui-object-transforms' ).hide()
                }
            }
        }

        log ( content, type ) {
            const _content = content ? content : 'Message logged'

            let _type

            switch ( type ) {
                case 0:
                    _type = 'reg'
                    break
                case 1:
                    _type = 'error'
                    break

                default:
                    _type = 'reg'
                    break
            }

            if ( this.logger != null ) this.logger( _content )[ _type ]()
            else {
                if ( _type == 'reg' ) _type = 'log'

                console[ _type ]( _content )
            }
        }
    }

    builder.gui = new GUI( gearz )
    builder.gui.init.controls()
} )()