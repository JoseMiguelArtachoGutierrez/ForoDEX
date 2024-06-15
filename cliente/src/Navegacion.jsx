import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './ConfiguracionUsuario'; // Importa useAuth
import { useNavigate } from "react-router-dom";
import { ref, get, onValue } from 'firebase/database';
import { database } from './Firebase';

function Navegacion({ pagina_actual }) {
    const { usuario, cerrarSesion } = useAuth(); // Obtén el usuario del contexto de autenticación y la función de cerrar sesión
    const navigate = useNavigate();
    const [userPhotoURL, setUserPhotoURL] = useState("");

    useEffect(() => {
        if (usuario) {
            const userRealtimeRef = ref(database, `Usuario/${usuario.uid}/img`);

            // Obtener la imagen de perfil inicial
            get(userRealtimeRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setUserPhotoURL(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            // Establecer un listener para cambios en tiempo real
            const unsubscribe = onValue(userRealtimeRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserPhotoURL(snapshot.val());
                } else {
                    console.log("No data available");
                }
            });

            // Cleanup: desuscribirse del listener cuando el componente se desmonte
            return () => unsubscribe();
        }
    }, [usuario]);

    async function cerrarSesionSeguro() {
        navigate("/");
        await cerrarSesion()
    }
    return (
        <header className="contenedor__header">
            <Link to="/" className="logo"><div>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M26.844 17.673c1.813 1.015 3.909 1.155 6.379.816"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M5.66 35.21c1.03-1.34 2.31-2.51 3.84-3.39c.97-.57 2.03-1.02 3.19-1.33c-2.6-2.84-3.94-15.92 6.03-16.42h.01c.19-.01.38-.01.58-.01c3.13 0 4.69 1.18 4.69 1.18s1.56-1.18 4.69-1.18c.2 0 .39 0 .58.01h.01c9.97.5 8.63 13.58 6.03 16.42c1.16.31 2.22.76 3.19 1.33c1.53.88 2.81 2.05 3.84 3.39"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M21.156 17.673c-1.813 1.015-3.909 1.155-6.379.816m6.513 3.869s.273-1.218-.417-1.92c0 0-.906.441-1.27 1.416c1.202.713 2.664.793 4.397.793s3.195-.08 4.396-.793c-.362-.975-1.269-1.417-1.269-1.417c-.69.703-.417 1.921-.417 1.921"/><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" d="M4.19 32.37c2.53-1.22 5.31-.55 5.31-.55s-1.66-4.88-.46-11.38c-.52-5.96.28-7.91.93-8.35c.68-.45 4.93-.18 8.75 1.98h.01c1.8-.92 3.66-1.46 5.27-1.46s3.47.54 5.27 1.46h.01c3.82-2.16 8.07-2.43 8.75-1.98c.65.44 1.45 2.39.93 8.35c1.2 6.5-.46 11.38-.46 11.38s2.78-.67 5.31.55"/><circle cx="24" cy="24" r="21.5" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div></Link>
            <ul>
                <div>
                    <div>
                        <li className={pagina_actual === 'pokedex' ? 'active' : ''}><Link to="/pokedex">Pokedex</Link></li>
                        <li className={pagina_actual === 'items' ? 'active' : ''}><Link to="/items">Items</Link></li>
                        <li className={pagina_actual === 'moves' ? 'active' : ''}><Link to="/moves/">Moves</Link></li>
                        <li className={pagina_actual === 'types' ? 'active' : ''}><Link to="/types">Types</Link></li>
                    </div>
                    <div>
                        {!usuario ? "" : <li className={pagina_actual === 'foroDEX' ? 'active' : ''}><Link to="/foroDEX">ForoDEX</Link></li>}
                    </div>
                </div>
                <div >
                {/* onClick={()=>{cerrarSesionSeguro(); navigate("/");}} */}
                    <li className={pagina_actual === 'usuario' ? 'active' : ''}>
                        {usuario ? (
                            <Link to="/profile">
                                {userPhotoURL!="" ? (
                                    <img src={userPhotoURL} alt="Imagen de perfil" className="imagenPerfil" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                                )}
                            </Link>
                        ) : (
                            <Link to="/usuario">
                                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" className="usuario" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
                                </svg>
                            </Link>
                        )}
                    </li>
                    <li className='hamburguesa'>
                        <div>
                            <span className="linea"></span>
                            <span className="linea"></span>
                            <span className="linea"></span>
                        </div>
                        <div>
                            <div><Link to="/pokedex">Pokedex</Link></div>
                            <div><Link to="/items">Items</Link></div>
                            <div><Link to="/moves/">Moves</Link></div>
                            <div><Link to="/types">Types</Link></div>
                            {!usuario ? "" : <div><Link to="/foroDEX">ForoDEX</Link></div>}
                            <div>{usuario ? (
                                <Link to="/profile">
                                    {userPhotoURL!="" ? (
                                        <img src={userPhotoURL} alt="Imagen de perfil" className="imagenPerfil" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" className='svgUsuario' viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6"/><path d="M2 12h7m6 0h7"/></g></svg>
                                    )}
                                </Link>
                            ) : (
                                <Link to="/usuario">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" className="usuario" viewBox="0 0 24 24">
                                        <path fill="#ffffff" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"/>
                                    </svg>
                                </Link>
                            )}</div>
                        </div>
                    </li>
                </div>
                
            </ul>
        </header>
    );
}

export default Navegacion;