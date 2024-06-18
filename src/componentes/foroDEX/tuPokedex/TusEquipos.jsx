import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, onValue, get, push, set, query, orderByChild, equalTo, remove } from 'firebase/database'; 
import { db, database } from '../../../Firebase';
import { useAuth } from '../../../ConfiguracionUsuario';

function TusEquipos({favorito}) {
    const { usuario } = useAuth(); // Assuming this hook provides the current user
    const [datosUsuario, setDatosUsuario] = useState([]);
    const [cargando, setCargando] = useState(true)
    const [crearEquipo, setCrearEquipo] = useState(false)
    const [arrayEquipo, setArrayEquipo] = useState([])
    const [titulo, setTitulo] = useState('');
    const [error, setError] = useState({titulo:false,pokemons:false})
    const [buscador,setbuscador] =useState('')
    const [userName, setUserName] = useState('');
    const [img, setImg] = useState('');
    const [arrayPublicaciones, setArrayPublicaciones] = useState([])

    useEffect(() => {
        const fetchPokedex = async () => {
            await cargarDatosFirebase();
        };

        if (usuario) {
            const userRef = ref(database, `Usuario/${usuario.uid}`);

            const fetchUserData = async () => {
                // Cargar datos de la Realtime Database
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserName(userData.userName);
                    setImg(userData.img);
                }

                // Configurar listener para cambios en userName e img
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const updatedUserData = snapshot.val();
                        setUserName(updatedUserData.userName);
                        setImg(updatedUserData.img);
                    }
                });
            };

            fetchUserData();
            const publicacionesRef = ref(database, 'publicaciones');
            const fetchPubliData = async () => {
                // Cargar datos de la Realtime Database
                const snapshot = await get(publicacionesRef);
                if (snapshot.exists()) {
                    const publiData = snapshot.val();
                    setArrayPublicaciones(publiData);
                }

                // Configurar listener para cambios en userName e img
                onValue(publicacionesRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const updatedPubliData = snapshot.val();
                        setArrayPublicaciones(updatedPubliData);
                    }
                });
            };
            fetchPubliData();
        }

        fetchPokedex();
    }, [usuario]);
    // Función para cargar los datos del usuario desde Firestore
    async function cargarDatosFirebase() {
        if (usuario) {
            const docRef = doc(db, "datosUsuario", usuario.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.tuPokedex) {
                    if (!data.tuPokedex.equipos) {
                        // Si 'equipos' no existe, crear el campo 'equipos'
                        await updateDoc(docRef, {
                            'tuPokedex.equipos': []
                        });
                        // Actualizar localmente después de crear el campo
                        data.tuPokedex.equipos = [];
                    }
                    setDatosUsuario(data);
                    setCargando(false);
                } else {
                    // Si 'tuPokedex' no existe, crearlo junto con 'equipos'
                    await updateDoc(docRef, {
                        tuPokedex: {
                            equipos: []
                        }
                    });
                    // Crear la estructura localmente
                    const newData = {
                        ...data,
                        tuPokedex: {
                            equipos: []
                        }
                    };
                    setDatosUsuario(newData);
                    setCargando(false);
                }
            } else {
                console.log("No such document!");
            }
        }
    }

    // Función para añadir o quitar un Pokémon del equipo
    function añadirPokemonEquipo(sprite) {
        if (arrayEquipo.includes(sprite)) {
            // Si el sprite ya está, elimínalo
            setArrayEquipo(arrayEquipo.filter(item => item !== sprite));
        } else {
            // Si el sprite no está en el equipo
            if (arrayEquipo.length < 6) {
                // Si hay menos de 6 elementos, añádelo
                setArrayEquipo([...arrayEquipo, sprite]);
            } else {
                // Si hay 6 elementos, quita el primero y añade el nuevo sprite
                setArrayEquipo([...arrayEquipo.slice(1), sprite]);
            }
        }
        setError({titulo:error.titulo,pokemons:false})
    }
    // Función para cambiar el título del equipo
    function cambiarTitulo(event) {
        const { value } = event.target;
        const regex = /^[a-zA-Z0-9(),.\s]*$/;

        // Solo actualiza el estado si la entrada coincide con el regex y no excede los 30 caracteres
        if (regex.test(value) && value.length <= 30) {
            setTitulo(value);
        }
        setError({titulo:false,pokemons:error.pokemons})
    }
    // Función para actualizar el equipo en la base de datos
    async function actualizarEquipoBaseDeDatos() {
        if (arrayEquipo.length === 6 && titulo !== '') {
            const docRef = doc(db, "datosUsuario", usuario.uid);
            
            // Obtener el documento actual del usuario
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const datosUsuario = docSnap.data();
                const equipos = datosUsuario.tuPokedex.equipos || [];
                
                // Verificar si ya existe un equipo con el mismo título y pokémons
                const equipoExistente = equipos.some(equipo => 
                    equipo.titulo === titulo && 
                    JSON.stringify(equipo.pokemons) === JSON.stringify(arrayEquipo)
                );
                
                if (equipoExistente) {
                    // Manejar el error de equipo duplicado aquí
                    setTitulo('');
                    setArrayEquipo([]);
                    setCrearEquipo(false);
                    return;
                }
            }
    
            const equipo = {
                titulo: titulo,
                favorito: false,
                pokemons: arrayEquipo
            };
    
            const updateData = {
                "tuPokedex.equipos": arrayUnion(equipo) // Reemplaza el campo pokemons con el nuevo valor
            };
    
            // Actualizamos solo el campo pokemons en Firestore
            await updateDoc(docRef, updateData);
            
            setTitulo('');
            setArrayEquipo([]);
            setCrearEquipo(false);
            setError({ titulo: false, pokemons: false });
            
            const updatedDocSnap = await getDoc(docRef);
            const updatedData = updatedDocSnap.data();
            setDatosUsuario(updatedData);
        } else {
            if (titulo === '' && arrayEquipo.length === 6) {
                setError({ titulo: true, pokemons: error.pokemons });
            } else if (arrayEquipo.length !== 6 && titulo !== '') {
                setError({ titulo: error.titulo, pokemons: arrayEquipo.length });
            } else {
                setError({ titulo: true, pokemons: arrayEquipo.length });
            }
        }
    }
    // Función para cambiar el estado 'favorito' de un equipo
    async function cambiarFavorito(index) {
        const docRef = doc(db, "datosUsuario", usuario.uid);
        let todosLosEquipos = [...datosUsuario.tuPokedex.equipos];
        if (index > 0 || index < todosLosEquipos.length) {
            todosLosEquipos[index].favorito = !todosLosEquipos[index].favorito;
            await updateDoc(docRef, {
                'tuPokedex.equipos': todosLosEquipos
            });
            const updatedDocSnap = await getDoc(docRef);
            const updatedData = updatedDocSnap.data();
            setDatosUsuario(updatedData)
        }
    }
    // Función para eliminar un equipo del array de equipos en tuPokedex
    async function eliminarEquipo(index) {
        const docRef = doc(db, "datosUsuario", usuario.uid);
        let todosLosEquipos = [...datosUsuario.tuPokedex.equipos];
        if (index > 0 || index < todosLosEquipos.length) {
            if(existeEquipo(usuario.uid,todosLosEquipos[index].titulo,todosLosEquipos[index].pokemons)){
                publicarEquipo(todosLosEquipos[index])
            }
            todosLosEquipos.splice(index, 1);
            await updateDoc(docRef, {
                'tuPokedex.equipos': todosLosEquipos
            });
            const updatedDocSnap = await getDoc(docRef);
            const updatedData = updatedDocSnap.data();
            setDatosUsuario(updatedData)
        }
    }
    // Función para verificar la existencia de un equipo específico en Firestore
    function existeEquipo(uid, titulo, pokemons) {
        try {
            // Verificar si arrayPublicaciones es un objeto JSON
            if (typeof arrayPublicaciones !== 'object' || arrayPublicaciones === null) {
                throw new Error("arrayPublicaciones no es un objeto JSON válido");
            }
    
            // Variable para almacenar el nombre del equipo encontrado
            let equipoExistenteNombre = null;
    
            // Recorrer las claves del objeto JSON (que representan los nombres de las variables de los equipos)
            Object.keys(arrayPublicaciones).forEach((key) => {
                const publicacion = arrayPublicaciones[key];
                if (publicacion.uid === uid &&
                    publicacion.titulo === titulo &&
                    JSON.stringify(publicacion.pokemons) === JSON.stringify(pokemons)) {
                    equipoExistenteNombre = key;
                }
            });
    
            if (equipoExistenteNombre) {
                console.log("Equipo encontrado:", equipoExistenteNombre);
                return equipoExistenteNombre; // Devuelve el nombre del equipo encontrado
            } else {
                console.log("Equipo no encontrado");
                return false; // Devuelve null si el equipo no se encuentra en el objeto JSON
            }
        } catch (error) {
            console.error("Error al verificar la existencia del equipo:", error);
            return false; // En caso de error, devuelve false
        }
    }
    // Función para publicar un equipo, ahora utilizando existeEquipo
    async function publicarEquipo(json) {
        try {
            const uid = usuario.uid;
            const { titulo, pokemons } = json;
    
            // Verificar si existe un equipo con los mismos detalles
            const equipoExiste = await existeEquipo(uid, titulo, pokemons);
            if (equipoExiste) {
                // Si existe un equipo con los mismos detalles, elimínalo
                await remove(ref(database, `publicaciones/${equipoExiste}`));
            } else {
                // Si no existe un equipo con los mismos detalles, crea uno nuevo
                const dataToSave = {
                    titulo: json.titulo,
                    pokemons: json.pokemons,
                    uid: uid,
                    estrellas:[uid]
                };
                
                await push(ref(database, 'publicaciones'), dataToSave);
                console.log("Nuevo equipo guardado exitosamente");
            }
    
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    }
    let contenido=<div className='tusEquipos'><div className="spinner-border " style={{ width: '3rem', height: '3rem', color:'#004316'}} role="status"><span className="visually-hidden">Loading...</span></div></div>
    if (!cargando) {
        contenido=<section className='tusEquipos'>
            {
                crearEquipo ? 
                <div className='crearEquipo'>
                    <div className='headerEquipo'>
                        <div>
                            <div className='imagenUsuario'>
                                {img!="" ? (
                                    <img src={img} alt="Imagen de perfil" className="imagenPerfil" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                                )}
                            </div>
                            <p>{userName}</p>
                        </div>
                        
                        
                        <input type="text" placeholder='Title' maxLength='30' value={titulo} onChange={cambiarTitulo} className={error.titulo ? 'error' : ''}/>
                        <div>
                            <svg onClick={actualizarEquipoBaseDeDatos} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512"><path d="M448 71.9c-17.3-13.4-41.5-9.3-54.1 9.1L214 344.2l-99.1-107.3c-14.6-16.6-39.1-17.4-54.7-1.8-15.6 15.5-16.4 41.6-1.7 58.1 0 0 120.4 133.6 137.7 147 17.3 13.4 41.5 9.3 54.1-9.1l206.3-301.7c12.6-18.5 8.7-44.2-8.6-57.5z" fill="#ffffff"/></svg>
                            <svg onClick={()=>{
                                setCrearEquipo(false)
                                setArrayEquipo([])
                                setTitulo('')
                                setError({titulo:false,pokemons:false})
                            }} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 11 11"><path d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 0 1 .5-.2a.75.75 0 0 1 .7.7a.66.66 0 0 1-.2.48L6.49 5.5L9.8 8.82c.13.126.202.3.2.48a.75.75 0 0 1-.7.7a.67.67 0 0 1-.5-.2L5.5 6.51L2.21 9.8a.67.67 0 0 1-.5.2a.75.75 0 0 1-.71-.71a.66.66 0 0 1 .2-.48L4.51 5.5L1.19 2.18A.66.66 0 0 1 1 1.7a.75.75 0 0 1 .7-.7a.67.67 0 0 1 .5.19z" fill="#ffffff"/></svg>
                        </div>
                    </div>
                    <div className='bodyEquipo'>
                        
                            {arrayEquipo[0] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[0])}}>
                                    {arrayEquipo[0].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[0]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<1 ? {border:"3px solid red"} : {}}></div>}
                            {arrayEquipo[1] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[1])}}>
                                    {arrayEquipo[1].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[1]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<2 ? {border:"3px solid red"} : {}}></div>}
                            {arrayEquipo[2] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[2])}}>
                                    {arrayEquipo[2].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[2]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<3 ? {border:"3px solid red"} : {}}></div>}
                            {arrayEquipo[3] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[3])}}>
                                    {arrayEquipo[3].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[3]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<4 ? {border:"3px solid red"} : {}}></div>}
                            {arrayEquipo[4] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[4])}}>
                                    {arrayEquipo[4].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[4]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<5 ? {border:"3px solid red"} : {}}></div>}
                            {arrayEquipo[5] ? <div className='contenedorCreandoUnEquipo' onClick={()=>{añadirPokemonEquipo(arrayEquipo[5])}}>
                                    {arrayEquipo[5].includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={arrayEquipo[5]} alt="" />
                                </div> : <div style={error.pokemons!==false  && error.pokemons<6 ? {border:"3px solid red"} : {}}></div>}
                    </div>
                </div>
                :
                <button onClick={()=>{setCrearEquipo(true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#33844E" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z"/></g></svg>
                </button>
            }
            
            
            
            {crearEquipo ?
                <div className='pokemonsEquipos'>
                    <input type="text" placeholder='Search Pokemon' onChange={(event) => {setbuscador(event.target.value.toLowerCase());}} />
                    {datosUsuario.tuPokedex.pokemons.map( (element,index)=>{
                        let mostrar=true
                        if (favorito && !element.favorito) {
                            mostrar=false
                        }
                        if (buscador!='' && !element.nombre.startsWith(buscador)) {
                            mostrar=false
                        }
                        if (mostrar) {
                            return <article key={index} onClick={()=>{añadirPokemonEquipo(element.sprite)}}>
                                    <div className={(arrayEquipo.includes(element.sprite))? 'activo': ''}></div>
                                    {element.sprite.includes("shiny") ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                    : ""}
                                    <img src={element.sprite} alt="" />
                                    <h1>{element.nombre}</h1>
                                </article>
                        }
                        
                    })}
                </div>
            :
                <div className='todosTusEquipos'>
                    {datosUsuario.tuPokedex.equipos.map( (element,index)=>{
                        let icono = existeEquipo(usuario.uid, element.titulo, element.pokemons)
                        if (!favorito || (favorito && element.favorito)) {
                            return <div className='crearEquipo' key={index}>
                                <div className='headerEquipo'>
                                    <div>
                                        <div className='imagenUsuario'>
                                            {img!="" ? (
                                                <img src={img} alt="Imagen de perfil" className="imagenPerfil" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                                            )}
                                        </div>
                                        <p>{userName}</p>
                                    </div>
                                    
                                    
                                    <h1 style={{margin:0}}>{element.titulo}</h1>
                                    <div >
                                        { icono == false ? 
                                            <svg onClick={()=>{publicarEquipo(element)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="none" stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="14;0"/></path><path fill="#ffffff" d="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"><animate attributeName="d" calcMode="linear" dur="1.5s" keyTimes="0;0.7;1" repeatCount="indefinite" values="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5;M12 15 h2 v-3 h2.5 L12 7.5M12 15 h-2 v-3 h-2.5 L12 7.5;M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"/></path></g></svg>
                                        :
                                            <svg onClick={()=>{publicarEquipo(element)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><mask id="IconifyId19019ae779c5669040"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="14;0"/></path><path fill="#fff" d="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"><animate attributeName="d" calcMode="linear" dur="1.5s" keyTimes="0;0.7;1" repeatCount="indefinite" values="M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5;M12 15 h2 v-3 h2.5 L12 7.5M12 15 h-2 v-3 h-2.5 L12 7.5;M12 15 h2 v-6 h2.5 L12 4.5M12 15 h-2 v-6 h-2.5 L12 4.5"/></path><g stroke-dasharray="26" stroke-dashoffset="26" transform="rotate(45 13 12)"><path stroke="#000" d="M0 11h24"/><path d="M0 13h22"><animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0 13h22;M2 13h22;M0 13h22"/></path><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="26;0"/></g></g></mask><rect width="24" height="24" fill="#ffffff" mask="url(#IconifyId19019ae779c5669040)"/></svg>                                        }
                                        {element.favorito?
                                            <svg onClick={()=>{cambiarFavorito(index)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M240 98a57.63 57.63 0 0 1-17 41l-89.3 90.62a8 8 0 0 1-11.4 0L33 139a58 58 0 0 1 82-82.1l13 12.15l13.09-12.19A58 58 0 0 1 240 98"/></svg>
                                        :
                                            <svg onClick={()=>{cambiarFavorito(index)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M225.84 54.13a62.07 62.07 0 0 0-87.52-.13L128 63.58L117.68 54a62 62 0 0 0-87.58 87.8l89.35 90.65a12 12 0 0 0 17.1 0l89.29-90.59a62 62 0 0 0 0-87.7Zm-17 70.79L128 206.9l-80.87-82.05a38 38 0 0 1 53.74-53.74c.1.1.2.2.31.29l18.64 17.36a12 12 0 0 0 16.36 0l18.64-17.36c.11-.09.21-.19.31-.29a38 38 0 1 1 53.68 53.81Z"/></svg>
                                        }
                                        <svg onClick={()=>{eliminarEquipo(index)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="#ffffff" d="M2.75 6.167c0-.46.345-.834.771-.834h2.665c.529-.015.996-.378 1.176-.916l.03-.095l.115-.372c.07-.228.131-.427.217-.605c.338-.702.964-1.189 1.687-1.314c.184-.031.377-.031.6-.031h3.478c.223 0 .417 0 .6.031c.723.125 1.35.612 1.687 1.314c.086.178.147.377.217.605l.115.372l.03.095c.18.538.74.902 1.27.916h2.57c.427 0 .772.373.772.834c0 .46-.345.833-.771.833H3.52c-.426 0-.771-.373-.771-.833M11.607 22h.787c2.707 0 4.06 0 4.941-.863c.88-.864.97-2.28 1.15-5.111l.26-4.081c.098-1.537.147-2.305-.295-2.792c-.442-.487-1.187-.487-2.679-.487H8.23c-1.491 0-2.237 0-2.679.487c-.441.487-.392 1.255-.295 2.792l.26 4.08c.18 2.833.27 4.248 1.15 5.112C7.545 22 8.9 22 11.607 22"/></svg>
                                    </div>
                                </div>
                                <div className='bodyEquipo'>
                                        {element.pokemons.map((element2,index)=>{
                                            return <div key={index}>
                                                {element2.includes("shiny") ? 
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                                                : ""}
                                                <img src={element2} alt="" />
                                                </div>
                                        })}
                                </div>
                            </div>
                        }
                        
                    })}
                </div>
            }
        </section>
    }
    

    return contenido
}
export default TusEquipos