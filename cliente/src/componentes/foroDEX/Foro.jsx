
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../ConfiguracionUsuario'; 
import { useNavigate } from "react-router-dom";
import ChatGlobal from './foro/ChatGlobal';
import Ranking from './foro/Ranking';

function Foro() {
    const [mostrarSection, setMostrarSection] = useState(true)
    return(
        <div className='foro'>
            <section>
                <div className='headerSection'>
                    <button onClick={()=>{setMostrarSection(true)}} className={mostrarSection ? 'active':''}>ChatGlobal</button>
                    <button onClick={()=>{setMostrarSection(false)}} className={!mostrarSection ? 'active':''}>Ranking</button>
                </div>
                <div>
                    {mostrarSection ? <ChatGlobal></ChatGlobal> : <Ranking></Ranking>}
                </div>
            </section>
        </div>
    )
}
export default Foro