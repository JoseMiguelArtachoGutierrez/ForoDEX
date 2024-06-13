import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../Firebase';
import { useAuth } from '../../ConfiguracionUsuario';
import { elements } from 'chart.js';
import TusPokemons from './tuPokedex/TusPokemons';
import TusEquipos from './tuPokedex/TusEquipos';

function TuPokedex() {
    const [seccion, setSeccion ] = useState("pokemon");
    const [favorito, setFavorito ] = useState(false);
    let mostrarSection
    switch (seccion) {
        case "pokemon":
            mostrarSection=<TusPokemons favorito={favorito}></TusPokemons>
            break;
        case "equipo":
            mostrarSection=<TusEquipos favorito={favorito}></TusEquipos>
        break;
        default:
            mostrarSection=<div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
            break;
    }
    return (
        <div className='miPropiaPokedex'>
            <div>
               <button onClick={()=>{setFavorito(!favorito)}} className={favorito ? "activo" : ""}>
                        {favorito ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M240 98a57.63 57.63 0 0 1-17 41l-89.3 90.62a8 8 0 0 1-11.4 0L33 139a58 58 0 0 1 82-82.1l13 12.15l13.09-12.19A58 58 0 0 1 240 98"/></svg>
                        :
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M225.84 54.13a62.07 62.07 0 0 0-87.52-.13L128 63.58L117.68 54a62 62 0 0 0-87.58 87.8l89.35 90.65a12 12 0 0 0 17.1 0l89.29-90.59a62 62 0 0 0 0-87.7Zm-17 70.79L128 206.9l-80.87-82.05a38 38 0 0 1 53.74-53.74c.1.1.2.2.31.29l18.64 17.36a12 12 0 0 0 16.36 0l18.64-17.36c.11-.09.21-.19.31-.29a38 38 0 1 1 53.68 53.81Z"/></svg>
                        }
                
                </button> 

                <button onClick={()=>{setSeccion("pokemon")}} className={seccion=="pokemon" ? "activo" : ""}>Pokemons</button>
                <button onClick={()=>{setSeccion("equipo")}} className={seccion=="equipo" ? "activo" : ""}>Teams</button>
            </div>
           
            {mostrarSection}
            
        </div>
        
    )
}
export default TuPokedex