import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../Firebase';
import { useAuth } from '../../ConfiguracionUsuario';
import pokeballImg from '../../assets/img/pokeball.png'
import superballImg from '../../assets/img/superball.png'
import ultraballImg from '../../assets/img/ultraball.png'

function Juego() {
    const { usuario, cerrarSesion } = useAuth();
    const [isClickable, setIsClickable] = useState(true);
    const [entrenadorPokemon, setEntrenadorPokemon]= useState("")
    const [pokeball,setPokeball] = useState(0)
    const [cargando, setcargando] = useState(true)
    const [cargandoPokemon, setCargandoPokemon] = useState(true)
    const [imagen, setImagen] =useState("");
    // Función para buscar un Pokémon aleatorio utilizando la API de Pokémon
    async function buscarPokemon() {
        if (isClickable) {
            setIsClickable(false)
            let numero= Math.floor(Math.random() * 1025) + 1;
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/'+ numero);
            if (response.ok) {
                const data = await response.json();

                setImagen({id:data.id,nombre:data.name,sprite:extraerImagenPokemon(data.sprites)})
                setCargandoPokemon(false)
                if (imagen!="") {
                    animacionPokemon()    
                }else{
                    setTimeout(()=>{setIsClickable(true)},2100)
                }
                
                
            } else {
                throw new Error('Failed to fetch Pokémon data');
            }
        }
        
    }
    // Función para cambiar la pokeball seleccionada
    function cambiarPokeball(direccion) {
        
        if (direccion=="izquierda") {
            if (pokeball==0) {
                setPokeball(2)
            }else{
                setPokeball(pokeball-1)
            }
        }else{
            if (pokeball==2) {
                setPokeball(0)
            }else{
                setPokeball(pokeball+1)
            }
        }
    }
    // Función para capturar el Pokémon actual
    function capturarPokemon() {
        
        if (imagen && isClickable) {
            setIsClickable(false)
            switch (pokeball) {
                case 0:
                    const probabilidad0 = Math.random();
                    const captura0 = probabilidad0 <= 0.6;
                    if (captura0) {
                        actualizarCapturaBaseDeDato()
                    }
                    actualizarBalls()
                    animacionCaptura(captura0);
                    break;
                case 1:
                    const probabilidad1 = Math.random();
                    const captura1 = probabilidad1 <= 0.75;
                    if (captura1) {
                        actualizarCapturaBaseDeDato()
                    }
                    actualizarBalls()
                    animacionCaptura(captura1);
                    break;
                case 2:
                    const probabilidad2 = Math.random();
                    const captura2 = probabilidad2 <= 0.9;
                    if (captura2) {
                        actualizarCapturaBaseDeDato()
                    }
                    actualizarBalls()
                    animacionCaptura(captura2);
                    break;
                default:
                    animacionCaptura(false);
                    console.log("error default switch")
                    break;
            }    
        }
        
    }
    // Función para actualizar el número de pokeballs disponibles en la base de datos
    async function actualizarBalls() {
        const docRef= doc(db, "datosUsuario", usuario.uid)
        if (entrenadorPokemon && entrenadorPokemon.ballDiarias !== undefined) {
            let updatedBalls = { ...entrenadorPokemon.ballDiarias.balls };

            if (pokeball === 0 && updatedBalls.poke > 0) {
                updatedBalls.poke -= 1;
            } else if (pokeball === 1 && updatedBalls.great > 0) {
                updatedBalls.great -= 1;
            } else if (pokeball === 2 && updatedBalls.ultra > 0) {
                updatedBalls.ultra -= 1;
            }

            // Aquí puedes agregar la lógica para actualizar Balldiarias si es necesario
            // Por ejemplo, sumar o restar una cantidad a Balldiarias dependiendo del resultado de la operación anterior
            // Actualizar los campos en Firestore
            await updateDoc(docRef, { 'ballDiarias.balls': updatedBalls });
        } else {
            console.error("No se encontró el campo Balldiarias en entrenadorPokemon.");
        }
        const updatedDocSnap = await getDoc(docRef);
        const updatedData = updatedDocSnap.data();
        setEntrenadorPokemon(updatedData)
    }
    // Función para actualizar la base de datos con el nuevo Pokémon capturado
    async function actualizarCapturaBaseDeDato() {
        const docRef= doc(db, "datosUsuario", usuario.uid)
        const nuevoPokemon = {
            id: imagen.id,
            nombre: imagen.nombre,
            sprite: imagen.sprite.props.children[2].props.src,
            favorito:false
        };
        if (entrenadorPokemon.tuPokedex) {
            // Construimos el objeto con la actualización que queremos realizar
            const updateData = {
                "tuPokedex.pokemons": arrayUnion(nuevoPokemon) // Reemplaza el campo pokemons con el nuevo valor
            };
            // Actualizamos solo el campo pokemons en Firestore
            await updateDoc(docRef, updateData);
        } else {
            // Creamos tuPokedex con el nuevoPokemon
            const tuPokedex = {tuPokedex:{
                pokemons: [nuevoPokemon]
            }};
            // Actualizamos el documento en Firestore con tuPokedex
            await updateDoc(docRef, tuPokedex ); 
        }
        
    }
    // Función para manejar la animación de captura de Pokémon
    function animacionCaptura(resultado) {
        
        const elementoPokemon= document.getElementById('captura2')
        const elementoPokemonContainer= document.getElementById('captura')
        const estrellitas= document.getElementById('estrellitas')
        if (elementoPokemon) {
            elementoPokemon.style.animation=""
            elementoPokemon.style.width="100px !important"
            elementoPokemon.style="transition:0.5s ease; width:100px !important;height:100px !important;"
            switch (pokeball) {
                case 0:
                    elementoPokemon.src=pokeballImg
                    break;
                case 1:
                    elementoPokemon.src=superballImg
                    break;
                case 2:
                    elementoPokemon.src=ultraballImg
                    break;
                default:
                    break;
            }
            setTimeout(()=>{
                if (elementoPokemon) {
                    elementoPokemon.style.opacity=1
                    elementoPokemon.style.animation="agitar 1s infinite ease forwards alternate";
                    estrellitas.style.transition="0.5s ease"
                    setTimeout(()=>{
                        if (elementoPokemon) {
                            elementoPokemon.style.animation=""
                            if (resultado) {
                                estrellitas.style.display="block"
                                setTimeout(()=>{buscarPokemon()
                                    if (isClickable===false) {
                                        setIsClickable(true)
                                    }
                                },500)
                            }else{
                                elementoPokemon.src=imagen.sprite.props.children[2].props.src
                                elementoPokemon.style="width:90% ;height:100%;"
                                setIsClickable(true)
                            }
                        }
                        
                        
                    },2000)
                }
                
            },100)
        }
    }
    // Función para manejar la animación cuando se encuentra un nuevo Pokémon
    function animacionPokemon() {
        if (document.getElementById('captura')) {
            document.getElementById('captura').style.animation=''
            setTimeout(()=>{
                if (document.getElementById('captura')) {
                    document.getElementById('captura').style.animation='encontrarPokemon 1s ease forwards';
                    setIsClickable(true)
                }
                
            },2700)
        }
    }
    // Función para extraer imágenes de Pokémon del objeto JSON proporcionado
    function extraerImagenPokemon(json) {
        const shinyImages = [];
        const normalImages = [];
    
        function recurse(obj) {
            for (let key in obj) {
                if (typeof obj[key] === 'string' && obj[key].startsWith('https') && 
                    (obj[key].endsWith('.png') || obj[key].endsWith('.gif') || obj[key].endsWith('.svg'))) {
                    
                    const url = obj[key];
                    let className = '';
        
                    // Añadir clase 'gif' si corresponde
                    if (url.endsWith('.gif') || url.includes('/x-y/')) {
                        className = 'gif';
                    }
        
                    // Ignorar imágenes de generation-i o generation-ii sin 'transparent'
                    if ((url.includes('generation-i') || (url.includes('generation-ii')) && !url.includes('transparent')) || url.includes('icons') ) {
                        continue;
                    }
        
                    const imgElement = (
                        <div id='captura' className="pokemonAcapturar" style={{animation:'encontrarPokemon 2s ease 1s forwards'}} key={url}>
                            {key.includes('shiny') && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                                    <path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/>
                                </svg>
                            )}
                            <div className='estrellas' id='estrellitas' style={{display:"none"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#ffffff" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#ffffff" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#ffffff" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                            </div>
                            <img id='captura2' src={url} className={className} style={{width:"90%",height:"100%"}} alt="" />
                        </div>
                    );
        
                    // Clasificar imágenes según si son shiny o normales
                    if (key.includes('shiny')) {
                        shinyImages.push(imgElement);
                    } else {
                        normalImages.push(imgElement);
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recurse(obj[key]);
                }
            }
        }
        
    
        recurse(json);
    
        const allImages = [...shinyImages, ...normalImages];
    
        function getRandomImage() {
            const rand = Math.random();
            if (rand < 0.1 && shinyImages.length > 0) {
                // 25% chance to get a shiny image
                return shinyImages[Math.floor(Math.random() * shinyImages.length)];
            } else if (normalImages.length > 0) {
                // 75% chance to get a normal image
                return normalImages[Math.floor(Math.random() * normalImages.length)];
            } else if (shinyImages.length > 0) {
                // Fallback to shiny images if no normal images are available
                return shinyImages[Math.floor(Math.random() * shinyImages.length)];
            }
        }
        
        setcargando(false);
        
        return getRandomImage();
    }
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const obtenerUserName = async () => {
            if (usuario && usuario.uid) {
                const docRef = doc(db, "datosUsuario", usuario.uid);
                const todosDatos = await getDoc(docRef);

                if (todosDatos.exists()) {
                    const data = todosDatos.data();
                    const fechaConexion = Math.floor(Date.now() / 1000);
                    if (data.ballDiarias) {
                        if (data.ballDiarias.fechaConexion.seconds>fechaConexion ) {
                            setEntrenadorPokemon(data)      
                            buscarPokemon() 
                        }else{
                            let fechaConexion2= new Date(fechaConexion *1000)
                            fechaConexion2.setHours(fechaConexion2.getHours() + 24);
                        
                            const ballDiarias = {
                                fechaConexion:fechaConexion2,
                                balls: {
                                    poke: 3,
                                    great: 2,
                                    ultra: 1
                                }
                            };

                            await setDoc(docRef, { ballDiarias }, { merge: true });
                            const updatedDocSnap = await getDoc(docRef);
                            const updatedData = updatedDocSnap.data();
                            setEntrenadorPokemon(updatedData)
                        }
                        
                    }else{
                        let fechaConexion2= new Date(fechaConexion *1000)
                        fechaConexion2.setHours(fechaConexion2.getHours() + 24);
                        
                        const ballDiarias = {
                            fechaConexion:fechaConexion2,
                            balls: {
                                poke: 3,
                                great: 2,
                                ultra: 1
                            }
                        };

                        await setDoc(docRef, { ballDiarias }, { merge: true });
                        const updatedDocSnap = await getDoc(docRef);
                        const updatedData = updatedDocSnap.data();
                        setEntrenadorPokemon(updatedData)
                    }
                    setcargando(false)
                } else {
                    console.log("No such document!");
                }
            }
        };

        obtenerUserName();
    }, [usuario]);

let pokebola=<div className='noPokeball'>
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16"><path fill="#004316" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>
    <p>You don't have more of this Ball</p>
</div>
if (!cargando ) {
    
    switch (pokeball) {
        case 0:
            if (entrenadorPokemon.ballDiarias.balls.poke!=0) {
                pokebola=<div onClick={!isClickable ? ()=>{}:capturarPokemon}><img src={pokeballImg} alt="" /></div>
            }
            break;
        case 1:
            if (entrenadorPokemon.ballDiarias.balls.great!=0) {
                pokebola=<div onClick={!isClickable ? ()=>{}:capturarPokemon}><img src={superballImg} alt="" /></div>
            }
            break;
        case 2:
            if (entrenadorPokemon.ballDiarias.balls.ultra!=0) {
                pokebola=<div onClick={!isClickable ? ()=>{}:capturarPokemon}><img src={ultraballImg} alt="" /></div>
            }
            break;
        default:
            break;
    }
    
}
    return(
        <div className='juego'>
            {!cargando ? <div>
                <div className='pokeballsDiarias'>
                    <div>
                        <div onClick={()=>{setPokeball(0)}}>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="" />
                        </div>
                        <p>{entrenadorPokemon.ballDiarias.balls.poke}</p>
                    </div>
                    <div>
                        <div onClick={()=>{setPokeball(1)}}>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" alt="" />
                        </div>
                        <p>{entrenadorPokemon.ballDiarias.balls.great}</p>
                    </div>
                    <div>
                        <div onClick={()=>{setPokeball(2)}}>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" alt="" />
                        </div>
                        <p>{entrenadorPokemon.ballDiarias.balls.ultra}</p>
                    </div>

                </div>
                
                <div className='pokemonBuscado'>
                    {!cargandoPokemon ? imagen.sprite : ""}
                </div>
                <button className='botonBuscar' onClick={buscarPokemon}>Search Pokemon</button>
                <div className='misPokeballs'>
                    <div>
                        <div onClick={()=>{cambiarPokeball("izquierda")}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="#33844E" d="m9.55 12l7.35 7.35q.375.375.363.875t-.388.875t-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675t-.15-.75t.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388t.375.875t-.375.875z"/></svg>
                        </div>
                        
                        {pokebola}

                        <div onClick={()=>{cambiarPokeball("derecha")}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50   " height="50" viewBox="0 0 24 24"><path fill="#33844E" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"/></svg>
                        </div>
                    </div>
                </div>
                
            </div>  : ""}
            
            
            
        </div>
    )
}
export default Juego