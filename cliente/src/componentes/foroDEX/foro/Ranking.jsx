import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../ConfiguracionUsuario"
import { useNavigate } from "react-router-dom";
import { ref as dbRef, onValue, get, set, update } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, database, storage } from '../../../Firebase';

function Ranking() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios]= useState({})
    const [publicaciones, setpublicaciones]= useState({})
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (usuario) {
            const userRef = dbRef(database, `Usuario`);
            const fetchUserData = async () => {
                // Cargar datos de la Realtime Database
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUsuarios(userData)
                }

                // Configurar listener para cambios en userName e img
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const updatedUserData = snapshot.val();
                        setUsuarios(updatedUserData)
                    }
                });
            };
            fetchUserData();

            const publiRef = dbRef(database, `publicaciones`);
            const fetchPubliData = async () => {
                // Cargar datos de la Realtime Database
                const snapshot = await get(publiRef);
                if (snapshot.exists()) {
                    const publiData = snapshot.val();
                    setpublicaciones(publiData)
                }

                // Configurar listener para cambios en userName e img
                onValue(publiRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const updatedPubliData = snapshot.val();
                        setpublicaciones(updatedPubliData)
                    }
                });
            };

            fetchPubliData();
            setCargando(false)
        }
    }, [usuario]);
    function darEstrellita(key) {
        // Verificar si la clave existe en el array de publicaciones
        if (publicaciones.hasOwnProperty(key)) {
            
            let estrellitas = publicaciones[key].estrellas || [];
            
            const usuarioUid = usuario.uid;
            const index = estrellitas.indexOf(usuarioUid);
            
            if (index !== -1) {
                // La cadena existe en el array, eliminarla
                estrellitas.splice(index, 1);
            } else {
                // La cadena no existe en el array, agregarla
                estrellitas.push(usuarioUid);
            }
            console.log("entro", estrellitas)
            // Referenciar la ruta en la base de datos
            const publiRef = dbRef(database, `publicaciones/${key}`);
            
            // Actualizar los datos en la base de datos
            update(publiRef, {estrellas:estrellitas}).then(() => {
                console.log('Estrellitas actualizadas');
            }).catch((error) => {
                console.error('Error al actualizar estrellitas:', error);
            });
        } else {
            console.error('La clave especificada no existe en las publicaciones');
        }
    }
    const renderPublicaciones = () => {
        // Convertir las publicaciones a un array y ordenarlas
        const publicacionesOrdenadas = Object.entries(publicaciones).sort((a, b) => {
            return (b[1].estrellas.length - 1) - (a[1].estrellas.length - 1);
        });
    
        return publicacionesOrdenadas.map(([key, element]) => {
            let img = "";
            let userName = "";
            
            // Obtener la información del usuario correspondiente
            Object.entries(usuarios).forEach(([keyUsuario, elementUsuario]) => {
                if (keyUsuario === element.uid) {
                    img = elementUsuario.img;
                    userName = elementUsuario.userName;
                }
            });
    
            return (
                <div className='crearEquipo' key={key}>
                    <div className='headerEquipo'>
                        <div>
                            <div className='imagenUsuario'>
                                {img !== "" ? (
                                    <img src={img} alt="Imagen de perfil" className="imagenPerfil" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className='svgUsuario' viewBox="0 0 24 24">
                                        <g fill="none" stroke="#ffffff" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/>
                                            <path d="M2 12h7m6 0h7"/>
                                        </g>
                                    </svg>
                                )}
                            </div>
                            <p>{userName}</p>
                        </div>
                        
                        <h1 style={{margin: 0}}>{element.titulo}</h1>
                        {usuario.uid !=element.uid ?
                            <div className='estrellita'>
                                {!element.estrellas.includes(usuario.uid) ?
                                    <svg onClick={()=>{darEstrellita(key)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575l-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957l-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>
                                : 
                                    <svg onClick={()=>{darEstrellita(key)}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                        <path fill="#ffffff" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                }        
                                <p>{element.estrellas.length - 1}</p>
                            </div>
                        :
                            <div>
                                
                                {/* 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575l-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957l-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>
                                */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                    <path fill="#ffffff" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                                <p>{element.estrellas.length - 1}</p>
                            </div>
                        }
                        
                    </div>
                    <div className='bodyEquipo'>
                        {element.pokemons.map((element2, index) => (
                            <div key={index}>
                                {element2.includes("shiny") && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/>
                                    </svg>
                                )}
                                <img src={element2} alt="Pokémon" />
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return <div className='ranking'>
        {cargando ? <div className='tusEquipos'><div className="spinner-border " style={{ width: '3rem', height: '3rem', color:'#004316'}} role="status"><span className="visually-hidden">Loading...</span></div></div> 
         : <div>
                <h1>Ranking</h1>
                <div>
                    {renderPublicaciones()}
                </div>
            </div>}
        
    </div>
}
export default Ranking