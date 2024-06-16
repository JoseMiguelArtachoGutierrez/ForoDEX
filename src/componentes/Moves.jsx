import { useState, useEffect } from "react";
import { tipoPokemonImagen } from "../Funciones";
import { useNavigate, useParams } from "react-router-dom";

// https://pokeapi.co/api/v2/move/?offset=0&limit=937
function Moves() {
    const navigate = useNavigate();
    const {nombre} = useParams();
    console.log("ss",nombre)
    const [buscador, setbuscador]= useState (nombre!=undefined ? nombre : "")
    const [listaMove,setListaMove] = useState([])
    const [cargando, setCargando]= useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch('https://pokeapi.co/api/v2/move/?offset=0&limit=937');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datosItems = await response.json();
            await datosItems.results.forEach(element => {
                cargarDatosMoves(element.url);
            });
            setTimeout(()=>{setCargando(false)},1000)
            } catch (error) {
            console.log(error.message)
            setCargando(null)
            }
        };
        fetchData();
    }, []);
    function cargarDatosMoves(urlCargar) {
        const fetchData = async () => {
            try {
                const response = await fetch(urlCargar);
                if (!response.ok) {
                throw new Error('Failed to fetch data');
                }
                const detalles = await response.json();
                
                await setListaMove((data)=>[...data,detalles])
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchData();
    }
    return <div className="movesDiv">
        {cargando ? <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>
        : <section>
            <h1>Moves</h1>
            <input type="text" placeholder="Search Move" onChange={(e)=>{setbuscador(e.target.value.toLowerCase())}} />
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Class</th>
                            <th>Power</th>
                            <th>Accuracy</th>
                            <th>PP</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody >
                        {listaMove.map((element,index)=>{
                            if (buscador=="" || element.name.startsWith(buscador)) {
                                return <tr key={index}>
                                    <td>{element.name.charAt(0).toUpperCase() + element.name.slice(1)}</td>
                                    <td><div>{tipoPokemonImagen(element.type.name)}</div></td>
                                    <td>{element.damage_class.name.charAt(0).toUpperCase() + element.damage_class.name.slice(1)}</td>
                                    <td>{element.power}</td>
                                    <td>{element.accuracy}</td>
                                    <td>{element.pp}</td>
                                    <td>{element.priority}</td>
                                </tr>
                            }
                            
                        })}
                    </tbody>
                </table>
            </div>
            
                
            </section>}
    </div>
}
export default Moves