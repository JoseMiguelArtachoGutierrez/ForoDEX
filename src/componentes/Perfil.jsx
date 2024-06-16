import React, { useState, useEffect } from 'react';
import { useAuth } from "../ConfiguracionUsuario"
import { useNavigate } from "react-router-dom";
import { ref as dbRef, onValue, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, database, storage } from '../Firebase';

function Perfil() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [img, setImg] = useState('');
    const [editar, setEditar] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newImgFile, setNewImgFile] = useState(null);
    const [publicaciones, setpublicaciones]= useState({})

    useEffect(() => {
        if (usuario) {
            const userRef = dbRef(database, `Usuario/${usuario.uid}`);
            const fetchUserData = async () => {
                // Cargar datos de la Realtime Database
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserName(userData.userName);
                    setImg(userData.img);
                    setNewUserName(userData.userName)
                }

                // Configurar listener para cambios en userName e img
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const updatedUserData = snapshot.val();
                        setUserName(updatedUserData.userName);
                        setImg(updatedUserData.img);
                        setNewUserName(updatedUserData.userName)
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
                    // console.log("publi", publiData)
                    // Object.entries(publicaciones).map(([key, value]) => {
                    //     console.log(key,value, "perro")
                    // });
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
        }
    }, [usuario]);

    async function cerrarSesionSeguro() {
        navigate("/");
        await cerrarSesion()
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setNewImgFile(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!usuario) return;

        const userRef = dbRef(database, `Usuario/${usuario.uid}`);

        let imgURL = img;
        if (newImgFile) {
            const fileRef = storageRef(storage, `profile_images/${usuario.uid}/${newImgFile.name}`);
            const uploadTask = uploadBytesResumable(fileRef, newImgFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Puedes manejar el progreso de la subida si es necesario
                },
                (error) => {
                    console.error('Error al subir la imagen:', error);
                },
                async () => {
                    imgURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await set(userRef, {
                        userName: newUserName,
                        img: imgURL
                    });
                    setEditar(false);
                }
            );
        } else {
            await set(userRef, {
                userName: newUserName,
                img: imgURL
            });
            setEditar(false);
        }
    };
    function totalEstrellas() {
        let estrellasTotal=-1
        Object.entries(publicaciones).forEach(([key, element])=>{
            estrellasTotal+=element.estrellas.length-1
        })
        return estrellasTotal
    }

    return <div className="perfil">
        <div>
            {!editar ?
                <svg onClick={()=>{setEditar(!editar)}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#ffffff" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6.525q.5 0 .75.313t.25.687t-.262.688T11.5 5H5v14h14v-6.525q0-.5.313-.75t.687-.25t.688.25t.312.75V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>
            :
                <svg onClick={()=>{setEditar(!editar); setNewUserName(userName)}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 12 12"><path fill="#ffffff" d="M2.22 2.22a.75.75 0 0 1 1.06 0L6 4.939L8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6L9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061L3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6L2.22 3.28a.75.75 0 0 1 0-1.06"/></svg>
            }
            <div className='contenedorImg'>
                
                {img!="" ? <img src={img} alt="" /> : 
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                }
            </div>
            {editar ? <div className='foto'>
                <label htmlFor="foto">Upload photo
                </label>
                <input id='foto' type='file' accept='image/*' onChange={handleFileChange}/>
            </div> : ""}
            {!editar ?
                <h1>{userName}</h1>
            :
            <div className='nombre'>
                    <input type="text"  placeholder="Write your userName" value={newUserName} onChange={(e)=>{setNewUserName(e.target.value)}}  />
                <div onClick={handleSave}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512"><path d="M448 71.9c-17.3-13.4-41.5-9.3-54.1 9.1L214 344.2l-99.1-107.3c-14.6-16.6-39.1-17.4-54.7-1.8-15.6 15.5-16.4 41.6-1.7 58.1 0 0 120.4 133.6 137.7 147 17.3 13.4 41.5 9.3 54.1-9.1l206.3-301.7c12.6-18.5 8.7-44.2-8.6-57.5z" fill="#ffffff"/></svg>
                </div>
            </div>
            }
            {!editar ? <button onClick={cerrarSesionSeguro}>Log out</button> : ""}
            {!editar ? <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                <p>{totalEstrellas()}</p>
            </div> : ""}
        </div>
        <div>
            <h1>Your Team Posts</h1>
            <div>
                {Object.entries(publicaciones).map( ([key,element])=>{
                    if (element.uid==usuario.uid) {
                        return <div className='crearEquipo' key={key}>
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
                                    {/* 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575l-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957l-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>
                                    */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="#ffffff" d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                                <p>{element.estrellas.length-1}</p>
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
        </div>
    </div>
}
export default Perfil