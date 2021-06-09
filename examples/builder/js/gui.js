( function () {
    /*
        This is the GUI for the buider example. A modified version of this interface
        and the builder will be available in Civilia. Please understand that these 
        things are made by be and take a long time to create.
    
        @author Nikolas Karinja
    */ 

    class GUI {
        constructor ( GearZ ) {
            this.objectSelected = null

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
                checkNumber: number => { return number.toString().split( '.' )[ number.toString().split( '.' )[ 1 ] ? 1 : 0 ].length > 7 ? number.toFixed( 7 ) : number },
                transformations: {
                    update: () => {},
                },
                'object-transforms': {
                    update: () => {
                        if ( this.objectSelected != null ) {
                            const object = builder.objects[ this.objectSelected ]

                            GearZ.element( 'object-transforms-position-x' ).set.value( this.interfaces.checkNumber( object.position.x ) )
                            GearZ.element( 'object-transforms-position-y' ).set.value( this.interfaces.checkNumber( object.position.y ) )
                            GearZ.element( 'object-transforms-position-z' ).set.value( this.interfaces.checkNumber( object.position.z ) )

                            GearZ.element( 'object-transforms-rotation-x' ).set.value( `${ this.interfaces.checkNumber( GearZ.operations.convert( 'rad', object.rotation.x ).to.deg() ) } deg` )
                            GearZ.element( 'object-transforms-rotation-y' ).set.value( `${ this.interfaces.checkNumber( GearZ.operations.convert( 'rad', object.rotation.y ).to.deg() ) } deg` )
                            GearZ.element( 'object-transforms-rotation-z' ).set.value( `${ this.interfaces.checkNumber( GearZ.operations.convert( 'rad', object.rotation.z ).to.deg() ) } deg` )

                            GearZ.element( 'object-transforms-scale-x' ).set.value( this.interfaces.checkNumber( object.scale.x ) )
                            GearZ.element( 'object-transforms-scale-y' ).set.value( this.interfaces.checkNumber( object.scale.y ) )
                            GearZ.element( 'object-transforms-scale-z' ).set.value( this.interfaces.checkNumber( object.scale.z ) )
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
                    } else this.log( '( => set.transformation ) Not a type of transformation' ).error()
                }
            }

            this.init = {
                controls: () => {
                    const settings = this.settings,
                    set = this.set,
                    interfaces = this.interfaces

                    builder.controls.transform.setTranslationSnap( settings.translationSnap[ 1 ] )
                    builder.controls.transform.setRotationSnap( GearZ.operations.convert( 'deg', settings.rotationSnap[ 1 ] ).to.rad() )
                    builder.controls.transform.setScaleSnap( settings.scaleSnap[ 1 ] )

                    g3d.mesh.add( builder.controls.transform, false ).to( world.scene, false )

                    builder.controls.transform.addEventListener( 'dragging-changed', e => {
                        if ( world.scene.controls.orbit ) world.scene.controls.orbit.enabled = ! e.value
                    } )

                    builder.controls.transform.addEventListener( 'change', e => {
                        interfaces[ 'object-transforms' ].update()
                    } )

                    document.addEventListener( 'keypress', e => {
                        if ( interfaces.selected == 'transformations' || interfaces.selected == 'world' ) {
                            if ( e.code == 'KeyA' ) set.transformation( 'translate' )
                            else if ( e.code == 'KeyS' ) set.transformation( 'rotate' )
                            else if ( e.code == 'KeyD' ) set.transformation( 'scale' )
                            else if ( e.code == 'KeyQ' ) {
                                if ( settings.translationSnap[ 0 ] ) {
                                    settings.translationSnap[ 0 ] = false

                                    builder.controls.transform.setTranslationSnap( 0 )
                                } else {
                                    settings.translationSnap[ 0 ] = true

                                    builder.controls.transform.setTranslationSnap( settings.translationSnap[ 1 ] )
                                }
                            } else if ( e.code == 'KeyW' ) {
                                if ( settings.rotationSnap[ 0 ] ) {
                                    settings.rotationSnap[ 0 ] = false


                                    builder.controls.transform.setRotationSnap( 0 )
                                } else {
                                    settings.rotationSnap[ 0 ] = true

                                    builder.controls.transform.setRotationSnap( GearZ.operations.convert( 'deg', settings.rotationSnap[ 1 ] ).to.rad() )
                                }
                            } else if ( e.code == 'KeyE' ) {
                                if ( settings.scaleSnap[ 0 ] ) {
                                    settings.scaleSnap[ 0 ] = false

                                    builder.controls.transform.setScaleSnap( 0 )
                                } else {
                                    settings.scaleSnap[ 0 ] = true

                                    builder.controls.transform.setScaleSnap( settings.scaleSnap[ 1 ] )
                                }
                            }
                        }
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
                            } )
                        } else {
                            builder.controls.transform.detach()
                        }
                    } )
                }
            }
        }

        log ( content ) {
            const header = 'GUI'

            return {
                reg: () => console.log( `[ ${ header } ] ${ content }` ),
                error: () => console.error( `[ ${ header } ] <!> ${ content }` ),
            }
        }
    }

    builder.gui = new GUI( gearz )
    builder.gui.init.controls()
} )()