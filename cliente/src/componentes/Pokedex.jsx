import { useState, useEffect } from "react";
import { tipoPokemonImagen } from "../Funciones";
import { useNavigate } from "react-router-dom";

let url
function Pokedex() {
    const navigate = useNavigate();
    const [buscador, setbuscador]= useState ("")
    const [filtro, setFiltro]= useState({color1:"",color2:""})
    const [mostrarFiltros, setMostrarFiltros]= useState(false)
    const [listaPokemon,setListaPokemon] = useState([])
    const [cargando, setCargando]= useState(true)
    let spinner=<div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
    let tipos= ['fire', 'water', 'grass', 'electric', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock',
    'ghost', 'dark', 'dragon', 'steel', 'fairy']

    function colorFiltro(tipo) {
        if (filtro.color1=="") {
            setFiltro({color1:tipo,color2:filtro.color2})
        }else if(filtro.color1==tipo){
            setFiltro({color1:filtro.color2,color2:""})
        }else if (filtro.color2=="") {
            setFiltro({color1:filtro.color1,color2:tipo})
        }else if(filtro.color2==tipo){
            setFiltro({color1:filtro.color1,color2:""})
        }else{
            setFiltro({color1:filtro.color2,color2:tipo})
        }
    }
    /* DATOS POKEMON */
    function cargarDatosPokemon(urlCargar) {
        const fetchData = async () => {
            try {
                const response = await fetch(urlCargar);
                if (!response.ok) {
                throw new Error('Failed to fetch data');
                }
                const detallesPokemon = await response.json();
                let detalle=detallesPokemon
                await setListaPokemon((data)=>[...data,detalle])
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchData();
    }
     /* PRIMEROS 9 POKEMON */
     useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302');
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const datosPokemon = await response.json();
            datosPokemon.results.forEach(element => {
                cargarDatosPokemon(element.url);
            });
            setCargando(false)
          } catch (error) {
            console.log(error.message)
            setCargando(null)
          }
        };
        fetchData();
      }, []);

      /* MAP */
    let lista = listaPokemon.map((pokemon,index) =>{
        let mostrar=false
        let tipo1="";
        let tipo2=undefined;
        tipo1=pokemon.types[0].type.name
        tipo1=tipoPokemonImagen(tipo1)
        if (pokemon.types[1]!=null) {
            tipo2=pokemon.types[1].type.name
            tipo2=tipoPokemonImagen(tipo2)
        }

        if (filtro.color1!="") {
            if (pokemon.types[0].type.name == filtro.color1 || pokemon.types[0].type.name == filtro.color2) {
                if (pokemon.types[0].type.name == filtro.color2) {
                    if (pokemon.types[1]!=null && pokemon.types[1].type.name== filtro.color1) {
                        mostrar=true    
                    }
                }else if (filtro.color2=="" || (pokemon.types[1]!=null && (pokemon.types[1].type.name== filtro.color2)) ) {
                    mostrar=true
                }
            }else if (pokemon.types[1]!=null && (pokemon.types[1].type.name== filtro.color1)) {
                if (filtro.color2=="" || pokemon.types[0].type.name== filtro.color2) {
                    mostrar=true
                }
                
            }
        }else{
            mostrar=true
        }

        if (pokemon.name.toLowerCase().startsWith(buscador.toLocaleLowerCase()) && mostrar) {
            return  (
                <article key={pokemon.id} onClick={()=>{navigate("/pokemon/"+pokemon.id)}}>
                    
                    <div className="contenedorImgPokemon"><img className="v-100 h-100" src={pokemon.sprites.other["official-artwork"].front_default} alt={"No se a encontrado la imagen de " + pokemon.name} /></div>
                    <div>
                        <h3>{pokemon.name}</h3>
                        <ul>
                            <li>{tipo1}</li>
                            <li>{tipo2? tipo2: ""}</li>
                        </ul>
                    </div>
                </article>
            )
        }else{
            return ""
        }
        
    });
    let listaTipos= tipos.map((tipo)=>{
        if (filtro.color1==tipo || filtro.color2==tipo) {
            return <li className="marcado" onClick={()=>{colorFiltro(tipo)}}>{tipoPokemonImagen(tipo)}</li>
        }else{
            return <li onClick={()=>{colorFiltro(tipo)}}>{tipoPokemonImagen(tipo)}</li>
        }
    })

    return(
        <div className="pokedex">
            <section>
                <h1>Pokedex</h1>
                <div>
                    <input type="text" placeholder="Search Pokemon" onChange={(e)=>{setbuscador(e.target.value.toLowerCase())}} />
                    
                    <button onClick={()=>{setMostrarFiltros(!mostrarFiltros)}}>
                        <span className="linea"></span>
                        <span className="linea"></span>
                        <span className="linea"></span>
                    </button>
                </div>
                {mostrarFiltros ? <ul className="filtros">
                    <h4>Filtro: </h4>
                    <div>
                        {listaTipos}
                    </div>
                    
                </ul>: ""}
                
            </section>
            <section>
                {cargando ? spinner : lista}
            </section>

        </div>
    )
}
export default Pokedex;