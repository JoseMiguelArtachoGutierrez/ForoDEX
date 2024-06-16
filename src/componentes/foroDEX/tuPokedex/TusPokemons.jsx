import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../../Firebase';
import { useAuth } from '../../../ConfiguracionUsuario';

function TusPokemons({favorito}) {
    const [arrayPokedex, setArrayPokedex] = useState([]);
    const { usuario } = useAuth(); // Assuming this hook provides the current user
    const [cargando, setcargando] = useState(true)
    const [buscador,setbuscador] =useState('')

    useEffect(() => {
        const fetchPokedex = async () => {
            await cargarDatosFirebase()
        };
        fetchPokedex();
    }, [usuario]);
    // Función para cargar los datos del usuario desde Firestore
    async function cargarDatosFirebase() {
        if (usuario) {
            const docRef = doc(db, "datosUsuario", usuario.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("aqui estoy", data)
                if (data.tuPokedex && data.tuPokedex.pokemons) {
                    setArrayPokedex(data.tuPokedex);
                    
                    console.log(data.tuPokedex)
                } else {
                    // Actualizar el documento si falta `pokemons[]` en `tuPokedex`
                    await setDoc(docRef, {
                        ...data, // Mantener los datos existentes
                        tuPokedex: {
                        ...data.tuPokedex,
                        pokemons: [] // Inicializar pokemons como un array vacío o con los datos iniciales necesarios
                        }
                    }, { merge: true }); // Usar merge para mantener otros campos existentes

                    
                    const docSnap2 = await getDoc(docRef);
  
                    setArrayPokedex(docSnap2.data().tuPokedex)
                    console.log("No tuPokedex field found in the document");
                }
                setcargando(false)
            } else {
                console.log("No such document!");
            }
        }
    }
    // Función para eliminar un Pokémon del array de pokemons en tuPokedex
    async function eliminarPokemon(index) {
        const docRef = doc(db, "datosUsuario", usuario.uid);
        let pokemons = [...arrayPokedex.pokemons];
        if (index > 0 || index < pokemons.length) {
            pokemons.splice(index, 1);
            await updateDoc(docRef, {
                'tuPokedex.pokemons': pokemons
            });
            setArrayPokedex({
                ...arrayPokedex,
                pokemons
            });
        }
    }
    // Función para cambiar el estado 'favorito' de un Pokémon en el array de pokemons en tuPokedex
    async function cambiarFavorito(index) {
        const docRef = doc(db, "datosUsuario", usuario.uid);
        let pokemons = [...arrayPokedex.pokemons];
        if (index > 0 || index < pokemons.length) {
            pokemons[index].favorito = !pokemons[index].favorito;
            await updateDoc(docRef, {
                'tuPokedex.pokemons': pokemons
            });
            setArrayPokedex({
                ...arrayPokedex,
                pokemons
            });
        }
    }


    return (
        <section className='tuspokemons'>
            <input type="text" placeholder='Search Pokemon' onChange={(event) => {setbuscador(event.target.value.toLowerCase());}} />
            {!cargando ? arrayPokedex.pokemons.map((element,index)=>{
                let mostrar=true
                if (favorito && !element.favorito) {
                    mostrar=false
                }
                if (buscador!='' && !element.nombre.startsWith(buscador)) {
                    mostrar=false
                }
                if (mostrar) {
                    return <article key={index}>
                        <div className='corazon' onClick={()=>{cambiarFavorito(index)}}>
                            {element.favorito?
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M240 98a57.63 57.63 0 0 1-17 41l-89.3 90.62a8 8 0 0 1-11.4 0L33 139a58 58 0 0 1 82-82.1l13 12.15l13.09-12.19A58 58 0 0 1 240 98"/></svg>
                            :
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><path fill="#ffffff" d="M225.84 54.13a62.07 62.07 0 0 0-87.52-.13L128 63.58L117.68 54a62 62 0 0 0-87.58 87.8l89.35 90.65a12 12 0 0 0 17.1 0l89.29-90.59a62 62 0 0 0 0-87.7Zm-17 70.79L128 206.9l-80.87-82.05a38 38 0 0 1 53.74-53.74c.1.1.2.2.31.29l18.64 17.36a12 12 0 0 0 16.36 0l18.64-17.36c.11-.09.21-.19.31-.29a38 38 0 1 1 53.68 53.81Z"/></svg>
                            }
                        </div>
                        <div className='basura' onClick={()=>{eliminarPokemon(index)}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="#ffffff" d="M2.75 6.167c0-.46.345-.834.771-.834h2.665c.529-.015.996-.378 1.176-.916l.03-.095l.115-.372c.07-.228.131-.427.217-.605c.338-.702.964-1.189 1.687-1.314c.184-.031.377-.031.6-.031h3.478c.223 0 .417 0 .6.031c.723.125 1.35.612 1.687 1.314c.086.178.147.377.217.605l.115.372l.03.095c.18.538.74.902 1.27.916h2.57c.427 0 .772.373.772.834c0 .46-.345.833-.771.833H3.52c-.426 0-.771-.373-.771-.833M11.607 22h.787c2.707 0 4.06 0 4.941-.863c.88-.864.97-2.28 1.15-5.111l.26-4.081c.098-1.537.147-2.305-.295-2.792c-.442-.487-1.187-.487-2.679-.487H8.23c-1.491 0-2.237 0-2.679.487c-.441.487-.392 1.255-.295 2.792l.26 4.08c.18 2.833.27 4.248 1.15 5.112C7.545 22 8.9 22 11.607 22"/></svg></div>
                        <div className='contenedorImagenPokemon'>
                            {element.sprite.includes("shiny") ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#dc2626" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>
                            : ""}
                            <img src={element.sprite} style={{width:"100%",height:"100%"}} alt="" />
                        </div>
                        <h2>{element.nombre.charAt(0).toUpperCase() + element.nombre.slice(1)}</h2>
                    </article>
                }
                
            }) : <div className="spinner-border " style={{ width: '3rem', height: '3rem', color:'#004316'}} role="status"><span className="visually-hidden">Loading...</span></div>}
        </section>
    )
}
export default TusPokemons