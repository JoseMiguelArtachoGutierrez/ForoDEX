import { useState, useEffect } from "react";
import { tipoPokemonImagen } from "../Funciones";
import { useNavigate } from "react-router-dom";


function Items({nombre}) {
    const navigate = useNavigate();
    const [buscador, setbuscador]= useState ("")
    const [listaItem,setListaItem] = useState([])
    const [cargando, setCargando]= useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch('https://pokeapi.co/api/v2/item/?offset=0&limit=2110');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datosItems = await response.json();
            await datosItems.results.forEach(element => {
                cargarDatosItems(element.url);
            });
            setTimeout(()=>{setCargando(false)},1000)
            } catch (error) {
            console.log(error.message)
            setCargando(null)
            }
        };
        fetchData();
    }, []);
    function cargarDatosItems(urlCargar) {
        const fetchData = async () => {
            try {
                const response = await fetch(urlCargar);
                if (!response.ok) {
                throw new Error('Failed to fetch data');
                }
                const detalles = await response.json();
                
                await setListaItem((data)=>[...data,detalles])
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchData();
    }
    return (
        <div className="items">
            
            {cargando ?
                <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
            :
                <section>
                    <h1>Items</h1>
                    <input type="text" placeholder="Search Item" onChange={(e)=>{setbuscador(e.target.value.toLowerCase())}} />
                    {listaItem.map((element,index)=>{
                        
                        if (element.sprites.default && element.effect_entries[0] && (buscador=='' || element.name.startsWith(buscador))) {

                            return <article key={index} style={{display:'flex'}}>
                                <div className="imagenItem"><img src={element.sprites.default} alt="" /></div>
                                <div className="descripcion">
                                    <h1>{element.name.charAt(0).toUpperCase() + element.name.slice(1)}</h1>
                                    <p>{element.effect_entries[0].effect}</p>
                                </div>
                                <div className="atributos">
                                    <h1>Atributes</h1>
                                    <ul>
                                        {element.attributes.map(element2=>{
                                            return <li>{element2.name.charAt(0).toUpperCase() + element2.name.slice(1)}</li>
                                        })}
                                    </ul>
                                </div>
                            </article>    
                        }
                        
                    })}
                </section>
            }
        </div>
    )
}
export default Items