import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./DashboardNoticias.css";

function DashboardNoticias() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [noticias, setNoticias] = useState([]);

    // 🔹 Cargar noticias según rol
    const fetchNoticias = async () => {
        const snapshot = await getDocs(collection(db, "noticias"));
        let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (role === "reportero") {
            // Solo mostrar noticias del reportero
            data = data.filter((n) => n.autor === user.email);
        }
        setNoticias(data);
    };

    useEffect(() => {
        fetchNoticias();
    }, []);

    // 🔹 Actualizar estado de la noticia
    const handleEstado = async (id, nuevoEstado) => {
        const noticiaRef = doc(db, "noticias", id);
        await updateDoc(noticiaRef, {
            estado: nuevoEstado,
            fechaActualizacion: serverTimestamp(),
        });
        fetchNoticias();
    };

    // 🔹 Navegar a edición
    const handleEditar = (id) => {
        navigate(`/crear/${id}`); // Puedes usar la misma ruta de crear para editar con id
    };

    return (
        <div className="dashboard-noticias-container">
            <h2>Panel de Noticias</h2>
            {role === "reportero" && (
                <button
                    className="dashboard-btn crear-btn"
                    onClick={() => navigate("/crear")}
                >
                    Crear nueva noticia
                </button>
            )}
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Categoría</th>
                        <th>Autor</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {noticias.map((n) => (
                        <tr key={n.id}>
                            <td>{n.titulo}</td>
                            <td>{n.categoria}</td>
                            <td>{n.autor}</td>
                            <td>{n.estado}</td>
                            <td>
                                {role === "reportero" && (
                                    <>
                                        <button onClick={() => handleEditar(n.id)}>Editar</button>
                                        {n.estado === "Edición" && (
                                            <button onClick={() => handleEstado(n.id, "Terminado")}>
                                                Marcar como Terminado
                                            </button>
                                        )}
                                    </>
                                )}

                                {role === "editor" && (
                                    <>
                                        {n.estado !== "Publicado" && (
                                            <button onClick={() => handleEstado(n.id, "Publicado")}>
                                                Publicar
                                            </button>
                                        )}
                                        {n.estado !== "Desactivado" && (
                                            <button onClick={() => handleEstado(n.id, "Desactivado")}>
                                                Desactivar
                                            </button>
                                        )}
                                        <button onClick={() => handleEditar(n.id)}>Editar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardNoticias;
