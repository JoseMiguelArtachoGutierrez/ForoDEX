import React, { useState, useEffect } from 'react';
import { useAuth } from '../ConfiguracionUsuario'; 
import { useNavigate } from "react-router-dom";
import Juego from './foroDEX/Juego';
import Foro from './foroDEX/Foro';
import TuPokedex from './foroDEX/TuPokedex';

function Forodex() {
    const [cargando, setcargando] = useState(true)
    const [mostrarSection, setMostrarSection] = useState("juego")
    let seccion
    function cambiarSeccion(seccionACambiar) {
        setMostrarSection(seccionACambiar)
        setcargando(false)
    }
    switch (mostrarSection) {
        case "juego":
            seccion=<Juego></Juego>
            break;
        case "foro":
            seccion=<Foro></Foro>
            break;
        case "pokedex":
            seccion=<TuPokedex></TuPokedex>
            break;
        
        default:
            seccion=<div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
            break;
    }
    return(
        <div className='forodexContainer'>
            <h1>ForoDEX</h1>
            <div>
                <div className='navegacionForoDEX'>
                    <button onClick={()=>cambiarSeccion("juego")} style={ mostrarSection=="juego" ? {backgroundColor: '#004316'}:{}}>Game</button>
                    <button onClick={()=>cambiarSeccion("foro")} style={ mostrarSection=="foro" ? {backgroundColor: '#004316'}:{}}>Foro</button>
                    <button onClick={()=>cambiarSeccion("pokedex")} style={ mostrarSection=="pokedex" ? {backgroundColor: '#004316'}:{}}>Your Pokedex</button>
                </div>
                <div>
                    {seccion}
                </div>
            </div>
        </div>
    )
}
export default Forodex