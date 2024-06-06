import React, { useState, useEffect } from 'react';
import { useAuth } from '../ConfiguracionUsuario'; 
import { useNavigate } from "react-router-dom";

function Usuario() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUsername] = useState('');
    const [sesion, setSesion] = useState(true);
    const [registroCompletado, setRegistroCompletado] = useState(false); // Estado para controlar si el registro se ha completado
    const { iniciarSesionConGoogle, iniciarSesionConCorreoElectronico, registrarUsuarioConCorreoElectronico, cerrarSesion } = useAuth();

    async function GoogleLogin() {
        try {
            await iniciarSesionConGoogle();
            navigate("/")
            // Aquí podrías realizar acciones adicionales después de iniciar sesión con Google
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error.message);
        }
    }

    async function EmailLogin() {
        try {
            await iniciarSesionConCorreoElectronico(email, password);
            navigate("/")
            // Aquí podrías realizar acciones adicionales después de iniciar sesión con correo electrónico
        } catch (error) {
            console.error('Error al iniciar sesión con correo electrónico y contraseña:', error.message);
        }
    }

    async function EmailRegister() {
        try {
            await registrarUsuarioConCorreoElectronico(email, password,userName);
            navigate("/") // Actualiza el estado para indicar que el registro se ha completado
            // Aquí podrías realizar acciones adicionales después de registrar un nuevo usuario con correo electrónico
        } catch (error) {
            console.error('Error al registrar usuario con correo electrónico y contraseña:', error.message);
        }
    }

    function vuelta(direccion) {

        document.getElementById("animacion").style.animation= direccion + ' 2s ease forwards'
        setTimeout(()=>{
            setSesion(!sesion)
        },1000)
        setTimeout(()=>{
            document.getElementById("animacion").style.animation=''
        },2000)

    }

    let resultado;
    let titulo;
    if (sesion) {
        titulo = "Login";
        resultado = <button className='btn btn-success' onClick={EmailLogin}>{titulo}</button>;
    } else {
        titulo = "Register";
        resultado = <button style={{backgroundColor:'#33844E'}} className='btn btn-success' onClick={EmailRegister}>{titulo}</button>;
    }

    return (
        <section className='usuarioSection'>
            <article id='animacion' style={sesion ? {backgroundColor:'#33844E'} : {backgroundColor:'#004316'}}>
                <div style={sesion ? {justifyContent:'flex-end'} : {justifyContent:'flex-start'}}>
                    <div onClick={()=>vuelta("vueltaIzquierda")} style={sesion ? {display:'none'} : {}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#004316" d="m7.85 13l2.85 2.85q.3.3.288.7t-.288.7q-.3.3-.712.313t-.713-.288L4.7 12.7q-.3-.3-.3-.7t.3-.7l4.575-4.575q.3-.3.713-.287t.712.312q.275.3.288.7t-.288.7L7.85 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"/></svg>
                    </div>
                    <div onClick={()=>vuelta("vueltaDerecha")} style={!sesion ? {display:'none'} : {}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#33844E" d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"/></svg>
                    </div>
                </div>
                <h1>{titulo}</h1>
                <div>
                    <div className='inputs'>
                        <div style={ sesion ? {display: 'none'}:{}}>
                            <label htmlFor="nombreUsuario">UserName: </label>
                            <input type="text" id='nombreUsuario' onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="correo">Email: </label>
                            <input type="email" id='correo' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="contraseña">Password: </label>
                            <input type="password" id='contraseña' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {resultado}
                    </div>
                    </div>
                    <div>
                        <span></span>
                        <p>O</p>
                        <span></span>
                    </div>
                    <div>
                        <div onClick={GoogleLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16"><path fill="#33844E" d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301c1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/></svg>
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256"><path fill="#33844E" d="M216 104v8a56.06 56.06 0 0 1-48.44 55.47A39.8 39.8 0 0 1 176 192v40a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-16H72a40 40 0 0 1-40-40a24 24 0 0 0-24-24a8 8 0 0 1 0-16a40 40 0 0 1 40 40a24 24 0 0 0 24 24h24v-8a39.8 39.8 0 0 1 8.44-24.53A56.06 56.06 0 0 1 56 112v-8a58.14 58.14 0 0 1 7.69-28.32A59.78 59.78 0 0 1 69.07 28A8 8 0 0 1 76 24a59.75 59.75 0 0 1 48 24h24a59.75 59.75 0 0 1 48-24a8 8 0 0 1 6.93 4a59.74 59.74 0 0 1 5.37 47.68A58 58 0 0 1 216 104"/></svg>
                        </div>
                    </div>
                <div>

                </div>
            </article>
        </section>
    )
    
}

export default Usuario