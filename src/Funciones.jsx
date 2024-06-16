
import Acero from './assets/img/tipos/tipoAcero.png'
import Agua from './assets/img/tipos/tipoAgua.png'
import Bicho from './assets/img/tipos/tipoBicho.png'
import Dragon from './assets/img/tipos/tipoDragon.png'
import Electrico from './assets/img/tipos/tipoElectrico.png'
import Fantasma from './assets/img/tipos/tipoFantasma.png'
import Fuego from './assets/img/tipos/tipoFuego.png'
import Hada from './assets/img/tipos/tipoHada.png'
import Hielo from './assets/img/tipos/tipoHielo.png'
import Lucha from './assets/img/tipos/tipoLucha.png'
import Normal from './assets/img/tipos/tipoNormal.png'
import Planta from './assets/img/tipos/tipoPlanta.png'
import Psiquico from './assets/img/tipos/tipoPsiquico.png'
import Roca from './assets/img/tipos/tipoRoca.png'
import Siniestro from './assets/img/tipos/tipoSiniestro.png'
import Tierra from './assets/img/tipos/tipoTierra.png'
import Veneno from './assets/img/tipos/tipoVeneno.png'
import Volador from './assets/img/tipos/tipoVolador.png'

function tipoPokemonImagen(tipo) {
    let resultado="";
    switch (tipo) {
        case "fairy":
            resultado= <img className="w-100 h-100" src={Hada}/>
            break;
        case "bug":
            resultado= <img className="w-100 h-100" src={Bicho}/>
            break;
        case "normal":
            resultado= <img className="w-100 h-100" src={Normal}/>
            break;
        case "flying":
            resultado= <img className="w-100 h-100" src={Volador}/>
            break;
        case "poison":
            resultado= <img className="w-100 h-100" src={Veneno}/>
            break;
        case "grass":
            resultado= <img className="w-100 h-100" src={Planta}/>
            break;
        case "water":
            resultado= <img className="w-100 h-100" src={Agua}/>
            break;
        case "fire":
            resultado= <img className="w-100 h-100" src={Fuego}/>
            break;
        case "ghost":
            resultado= <img className="w-100 h-100" src={Fantasma}/>
            break;
        case "fighting":
            resultado= <img className="w-100 h-100" src={Lucha}/>
            break;
        case "dark":
            resultado= <img className="w-100 h-100" src={Siniestro}/>
            break;
        case "rock":
            resultado= <img className="w-100 h-100" src={Roca}/>
            break;
        case "ground":
            resultado= <img className="w-100 h-100" src={Tierra}/>
            break;
        case "electric":
            resultado= <img className="w-100 h-100" src={Electrico}/>
            break;
        case "steel":
            resultado= <img className="w-100 h-100" src={Acero}/>
            break;
        case "dragon":
            resultado= <img className="w-100 h-100" src={Dragon}/>
            break;
        case "psychic":
            resultado= <img className="w-100 h-100" src={Psiquico}/>
            break;
        case "ice":
            resultado= <img className="w-100 h-100" src={Hielo}/>
            break;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        default:
            break;
    }
    return resultado
}



export {tipoPokemonImagen};