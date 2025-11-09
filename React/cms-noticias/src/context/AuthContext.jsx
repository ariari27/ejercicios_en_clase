import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../firebase/firebaseConfig";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [user, setUser] = useState(null);   // Contendrá email, uid, nombre, etc.
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Escuchar cambios de sesión
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            nombre: userData.nombre || "", // Nuevo campo
                        });
                        setRole(userData.role || "");
                        console.log("📄 Datos del usuario leídos:", userData);
                    } else {
                        // Si no existe documento en Firestore
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            nombre: "",
                        });
                        setRole("");
                    }
                } catch (error) {
                    console.error("❌ Error leyendo datos del usuario:", error);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [auth, db]);

    // Registrar usuario y asignar rol y nombre
    const register = async (email, password, role, nombre = "") => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
            email,
            role,
            nombre,
        });

        return userCredential;
    };

    // Iniciar sesión
    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Cerrar sesión
    const logout = async () => {
        return signOut(auth);
    };

    const value = {
        user,   // { uid, email, nombre }
        role,
        loading,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
