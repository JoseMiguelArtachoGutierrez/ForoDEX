import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth,db, database } from './Firebase'; // Importa las instancias de autenticación y Firestore desde Firebase
import { ref, set,get } from 'firebase/database';
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
                const img = user.photoURL; // La imagen del perfil de Google
    
                // Referencia al documento del usuario en Firestore
                const userRef = doc(db, "datosUsuario", uid);
    
                // Verificar si el usuario ya está registrado en Firestore
                const userDoc = await getDoc(userRef);
                const userRealtimeRef = ref(database, `Usuario/${uid}`);
    
                // Verificar si el usuario ya está registrado en la Realtime Database
                const userRealtimeSnapshot = await get(userRealtimeRef);
    
                if (userDoc.exists() && userRealtimeSnapshot.exists()) {
                    // El usuario ya está registrado en ambas bases de datos, no hacer nada
                    console.log("Usuario ya registrado en ambas bases de datos");
                    return {
                        ...userDoc.data(),
                        ...userRealtimeSnapshot.val()
                    };
                } else {
                    // El usuario no está registrado, crear un nuevo documento en ambas bases de datos
                    if (!userDoc.exists()) {
                        await setDoc(userRef, {
                            uid: uid,
                            userName: userName
                        });
                    }
    
                    if (!userRealtimeSnapshot.exists()) {
                        await set(userRealtimeRef, {
                            userName: userName,
                            img: img
                        });
                    }
    
                    console.log("Usuario registrado exitosamente en ambas bases de datos");
                    return { uid: uid, userName: userName, img: img };
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

    async function registrarUsuarioConCorreoElectronico(email, password, userName) {
        try {
            // Registrar al usuario con correo y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Referencias a Firestore y Realtime Database
            const userRefFirestore = doc(db, "datosUsuario", user.uid);
            const userRefRealtime = ref(database, `Usuario/${user.uid}`);
    
            // Comprobar existencia en Firestore
            const userDocFirestore = await getDoc(userRefFirestore);
            const userExistsInFirestore = userDocFirestore.exists();
    
            // Comprobar existencia en Realtime Database
            const userSnapshotRealtime = await get(userRefRealtime);
            const userExistsInRealtime = userSnapshotRealtime.exists();
    
            if (!userExistsInFirestore) {
                // Usuario no existe en Firestore, crear nuevo registro
                await setDoc(userRefFirestore, {
                    img: "",
                    userName: userName
                });
                console.log("Usuario registrado en Firestore exitosamente");
            } else {
                console.log("El usuario ya existe en Firestore");
            }
    
            if (!userExistsInRealtime) {
                // Usuario no existe en Realtime Database, crear nuevo registro
                await set(userRefRealtime, {
                    img: "",
                    userName: userName
                });
                console.log("Usuario registrado en Realtime Database exitosamente");
            } else {
                console.log("El usuario ya existe en Realtime Database");
            }
    
        } catch (error) {
            // Manejo de errores
            console.error("Error al registrar usuario: ", error);
            throw error;
        }
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