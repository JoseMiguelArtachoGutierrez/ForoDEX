import { useState, useEffect } from "react";
import { tipoPokemonImagen } from "../Funciones";
import { useNavigate, useParams } from "react-router-dom";

function Types() {
    const todosLosTipos=["normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"]
    const [listaMove,setListaTipo] = useState([])
    const [cargando, setCargando]= useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetch('https://pokeapi.co/api/v2/type/');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datos = await response.json();
            await datos.results.forEach(element => {
                cargarDatosTipo(element.url);
            });
            setTimeout(()=>{setCargando(false)},1000)
            } catch (error) {
            console.log(error.message)
            setCargando(null)
            }
        };
        fetchData();
    }, []);
    function cargarDatosTipo(urlCargar) {
        const fetchData = async () => {
            try {
                const response = await fetch(urlCargar);
                if (!response.ok) {
                throw new Error('Failed to fetch data');
                }
                const detalles = await response.json();
                
                await setListaTipo((data)=>[...data,detalles])
            } catch (error) {
                console.log(error.message)
            }
        };
        fetchData();
    }

    function getDamageMultiplier(attackType, defenseType) {
        const typeDetail = listaMove.find(type => type.name === attackType);
        console.log("buenas",typeDetail)
        if (typeDetail.damage_relations.double_damage_from.some(type => type.name === defenseType)) {
            return 'x2';
        }
        if (typeDetail.damage_relations.half_damage_from.some(type => type.name === defenseType)) {
            return 'x0.5';
        }
        if (typeDetail.damage_relations.no_damage_from.some(type => type.name === defenseType)) {
            return 'x0';
        }
        return 'x1';
    };

    return <div className="componenteTipos">
        {cargando ? <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem'}} role="status"><span className="visually-hidden">Loading...</span></div>         
        :
        <section>
            <h1>Types</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                        <th></th>
                        {todosLosTipos.map((type, index) => (
                            <th key={index}><div>{tipoPokemonImagen(type)}</div></th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {todosLosTipos.map((type, rowIndex) => (
                            <tr key={rowIndex}>
                                <th><div>{tipoPokemonImagen(type)}</div></th>
                                {todosLosTipos.map((defenseType, colIndex) => (
                                <td key={colIndex}>{getDamageMultiplier(defenseType, type)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </section>
        }
    </div>
}
export default Types