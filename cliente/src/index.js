import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/styles.scss';

import { AuthProvider } from './ConfiguracionUsuario.jsx';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import reportWebVitals from './reportWebVitals';

import Navegacion from './Navegacion';
import Footer from './Footer.jsx';
import Pokedex from './componentes/Pokedex.jsx';
import Pokemon from './componentes/Pokemon.jsx';
import Usuario from './componentes/Usuario.jsx';
import Forodex from './componentes/Forodex.jsx';

const router = createBrowserRouter([
    {
      path: "/",
      element: 
      <>
        <Navegacion></Navegacion>
        
      </>,
      errorElement: <h1 className='text-center'>Ruta no válida</h1>
    },
    {
      path: "/pokedex",
      element: 
      <>
        <Navegacion pagina_actual='pokedex'></Navegacion>
        <Pokedex></Pokedex>
        <Footer></Footer>
      </>,
      errorElement: <h1 className='text-center'>Ruta no válida</h1>
    },
    {
      path: "/pokemon/:id",
      element: 
      <>
        <Navegacion></Navegacion>
        <Pokemon></Pokemon>
        <Footer></Footer>
      </>,
      errorElement: <h1 className='text-center'>Ruta no válida</h1>
    },
    {
      path: "/usuario",
      element: 
      <>
        <Navegacion pagina_actual='usuario'></Navegacion>
        <Usuario></Usuario>
        <Footer></Footer>
      </>,
      errorElement: <h1 className='text-center'>Ruta no válida</h1>
    },
    {
      path: "/foroDEX",
      element: 
      <>
        <Navegacion pagina_actual='foroDEX'></Navegacion>
        <Forodex></Forodex>
        <Footer></Footer>
      </>,
      errorElement: <h1 className='text-center'>Ruta no válida</h1>
    },
    
    
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
