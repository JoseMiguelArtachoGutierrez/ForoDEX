import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth,db } from './Firebase'; // Importa las instancias de autenticación y Firestore desde Firebase
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Importa funciones de autenticación de Firebase

// Crea un contexto de autenticación
const AuthContext = createContext();


// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
    return useContext(AuthContext);
}

// Proveedor de contexto de autenticación
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Escucha el cambio de estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUsuario(user);
            setCargando(false);
        });

        return () => unsubscribe();
    }, []);

    // Funciones relacionadas con la autenticación (por ejemplo, iniciar sesión, cerrar sesión, etc.)
    // function iniciarSesionConGoogle() {
        
    //     return signInWithPopup(auth, provider);
    // }
    function iniciarSesionConGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
            .then(async (result) => {
                // Usuario autenticado exitosamente con Google
                const user = result.user;
                const email = user.email;
                const uid = user.uid;
                const userName = email.split('@')[0];
    
                // Referencia al documento del usuario en Firestore
                const userRef = doc(db, "datosUsuario", uid);
    
                // Verificar si el usuario ya está registrado
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    // El usuario ya está registrado, no hacer nada
                    console.log("Usuario ya registrado");
                    return userDoc.data();
                } else {
                    // El usuario no está registrado, crear un nuevo documento
                    await setDoc(userRef, {
                        uid: uid,
                        userName: userName
                    });
                    console.log("Usuario registrado exitosamente");
                    return { uid: uid, userName: userName };
                }
            })
            .catch((error) => {
                // Manejo de errores
                console.error("Error al registrar/iniciar sesión con Google: ", error);
                throw error;
            });
    }

    function iniciarSesionConCorreoElectronico(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function registrarUsuarioConCorreoElectronico(email, password, userName) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Usuario registrado exitosamente
                const user = userCredential.user;

                // Crea una referencia al documento del usuario en Firestore
                const userRef = doc(db, "datosUsuario", user.uid);

                // Guarda el nombre de usuario en Firestore
                return setDoc(userRef, {
                    uid: user.uid,
                    userName: userName
                });
            })
            .catch((error) => {
                // Manejo de errores
                console.error("Error al registrar usuario: ", error);
                throw error;
            });
    }

    function cerrarSesion() {
        
        return auth.signOut();
    }

    const value = {
        usuario,
        iniciarSesionConGoogle,
        iniciarSesionConCorreoElectronico,
        registrarUsuarioConCorreoElectronico,
        cerrarSesion,
    };

    return (
        <AuthContext.Provider value={value}>
            {!cargando && children}
        </AuthContext.Provider>
    );
}