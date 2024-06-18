import { useState, useEffect } from "react";
import { tipoPokemonImagen } from "../Funciones";
import { useNavigate, useParams } from "react-router-dom";
import { Radar } from 'react-chartjs-2';
import Prueba from "./Prueba";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


function Pokemon() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [pokemon,setPokemon] = useState();
    const [imagen, setImagen] = useState(0);
    const [imagesArray, setImagesArray] =useState([]);
    const [cargando, setcargando] = useState(true)
    const [listaH,setListaH] =useState("")

    // Función para extraer las habilidades mediante una promesa
    function detallesHabilidad(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('https://pokeapi.co/api/v2/pokemon/'+id);
              if (!response.ok) {
                throw new Error('Failed to fetch data');
              }
                const datosPokemon = await response.json();
                setPokemon(datosPokemon);
                extraerImagenesPokemon(datosPokemon.sprites)
                setcargando(false)
                
            } catch (error) {
              console.log(error.message)
              setcargando(null)
            }
        };
        fetchData();
    }, []);
    // Función para extraer URLs de imágenes de un objeto JSON y almacenarlas en un array
    function extraerImagenesPokemon(json) {
        const images = [];
    
        // Función recursiva para recorrer el objeto JSON
        function recurse(obj) {
            for (let key in obj) {
                // Si la propiedad es una URL de imagen, se añade al array
                if (typeof obj[key] === 'string' && obj[key].startsWith('https') && 
                    (obj[key].endsWith('.png') || obj[key].endsWith('.gif') || obj[key].endsWith('.svg'))) {
                    
                    // Verificaciones adicionales
                    const url = obj[key];
                    let className = '';

                    // Clasificar imágenes GIF o de la serie X-Y
                    if (url.endsWith('.gif') || url.includes('/x-y/')) {
                        className = 'gif';
                    }
                    
                    // Ignorar imágenes de generación I o II que no sean transparentes
                    if ((url.includes('generation-i') || url.includes('generation-ii')) && !url.includes('transparent')) {
                        continue;
                    }

                    images.push(<div key={url}><img src={url} className={className} alt="" /></div>);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recurse(obj[key]);
                }
            }
        }
        recurse(json);

        // Ordenar las imágenes para priorizar las de arte oficial
        images.sort((a, b) => {
            const officialArtwork1 = a.props.children.props.src.includes('official-artwork');
            const officialArtwork2 = b.props.children.props.src.includes('official-artwork');
            
            if (officialArtwork1 && !officialArtwork2) {
                return -1;
            } else if (!officialArtwork1 && officialArtwork2) {
                return 1;
            } else {
                return 0;
            }
        });

        setImagesArray(images);
    }

    // Función para cambiar la imagen actual a la anterior en el array de imágenes
    function imgIzquierda() {
        const nuevaImagen = (imagen - 1 + imagesArray.length) % imagesArray.length;
        setImagen(nuevaImagen);
    }

    // Función para cambiar la imagen actual a la siguiente en el array de imágenes
    function imgDerecha() {
        const nuevaImagen = (imagen + 1) % imagesArray.length;
        setImagen(nuevaImagen);
    }

    
    const getMoveIdFromUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 2]; // La ID del movimiento está antes de la última barra
      };

    if (cargando===false) {
        const pokemonStats = pokemon.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat,
        }));
        const data = {
            labels: pokemonStats.map(stat => stat.name),
            datasets: [
              {
                label: `${pokemon.name} Stats`,
                data: pokemonStats.map(stat => stat.value),
                backgroundColor: 'rgba(144, 193, 160, 0.2)',
                borderColor: 'rgba(0, 67, 22, 1)',
                borderWidth: 1,
              },
            ],
        };
    
        const options = {
            scales: {
                r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 120
                }
            }
        };
        Promise.all(pokemon.abilities.map(async (habilidad, index) => {
            try {
                let p = "";
                let detalle = await detallesHabilidad(habilidad.ability.url);
                let efecto = "";
                detalle.effect_entries.forEach(element => {
                    if (element.language.name === "en") {
                        efecto = element.effect;
                    }
                });
                if (habilidad.is_hidden) {
                    p = <p >{habilidad.ability.name.toUpperCase()} [Oculta]</p>;
                } else {
                    p = <p >{habilidad.ability.name.toUpperCase()}</p>;
                }
                return (
                    <li className="d-flex justify-content-center align-items-center" key={index}>
                        {p}
                        <div className="dropdown">
                            <button className="dropdown-toggle contenedorInterrogacion"  id={"dropdownMenuButton" + index} data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="w-100 h-100" viewBox="0 0 24 24"><g fill="none"><circle cx="12" cy="12" r="10" stroke="#198754" strokeWidth="1.5" opacity="0.5" /><path stroke="#198754" strokeLinecap="round" strokeWidth="1.5" d="M10.125 8.875a1.875 1.875 0 1 1 2.828 1.615c-.475.281-.953.708-.953 1.26V13" /><circle cx="12" cy="16" r="1" fill="#198754" /></g></svg>
                            </button>
                            <ul className="dropdown-menu bg-success" aria-labelledby={"dropdownMenuButton" + index}>
                                <li className="prueba text-white">{efecto}</li>
                                
                            </ul>
                        </div>
                    </li>
                );
            } catch (error) {
                console.error('Error:', error);
                return null;
            }
        }))
        .then(resultados => {
            setListaH(resultados);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        const sortedMoves = pokemon.moves.sort((a, b) => {
            const levelA = a.version_group_details[0].level_learned_at;
            const levelB = b.version_group_details[0].level_learned_at;
            return levelA - levelB;
          });
        return(
            <section className="pokemon">
                <article className="galeria">
                    <h1 className="prueba">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }</h1>
                    <div>
                        <div onClick={imgIzquierda}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="#33844E" d="m9.55 12l7.35 7.35q.375.375.363.875t-.388.875t-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675t-.15-.75t.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388t.375.875t-.375.875z"/></svg>
                        </div>
                        
                        <div className="galeriaImagen" onClick={imgDerecha}>
                            {imagesArray[imagen]}
                        </div>
                        <div onClick={imgDerecha}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50   " height="50" viewBox="0 0 24 24"><path fill="#33844E" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"/></svg>
                        </div>
                    </div>
                </article>
                <article className="grafica">
                    <h1>Nº {pokemon.id}</h1>
                    <div className="radar">
                        <Radar data={data} options={options} className="w-100 h-100" />
                    </div>
                </article>
                <article className="datospokemon">
                    <p><span>Weight: </span> {pokemon.weight} Kg</p>
                    <div className="tipos">
                        <h4>Types</h4>
                        {pokemon.types[1]!=null ? <div>
                            <div>{tipoPokemonImagen(pokemon.types[0].type.name)}</div>
                            
                            <div>{tipoPokemonImagen(pokemon.types[1].type.name)}</div>
                        </div> : <div><div>{tipoPokemonImagen(pokemon.types[0].type.name)}</div></div>}
                    </div>
                    <div className="habilidades">
                        <h4>Abilities</h4>
                        <ul>
                            {listaH}
                        </ul>
                    </div>
                </article>
                <article className="movimientos">
                    <h1>Moves</h1>
                    <table>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMoves.map((moveData, index) => {
                            const moveName = moveData.move.name;
                            const moveUrl = moveData.move.url;
                            const moveId = getMoveIdFromUrl(moveUrl);
                            const level = moveData.version_group_details[0].level_learned_at;

                            return (
                                <tr key={index}>
                                <td>{moveName.charAt(0).toUpperCase() + moveName.slice(1)}</td>
                                <td>{level}</td>
                                <td>
                                    <button onClick={() => navigate(`/moves/${moveName}`)}>Details</button>
                                </td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </article>
            </section>
        )
    }else{
        if (cargando==null) {
            return(
                <h1>Error</h1>
            )
        }else{
            return(
                <section className="spinnerSection">
                    <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
                </section>
                
            )
        }
        
    }
    
}

export default Pokemon