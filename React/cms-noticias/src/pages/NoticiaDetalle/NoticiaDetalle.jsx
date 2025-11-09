import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./NoticiaDetalle.css";

const NoticiaDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [noticia, setNoticia] = useState(null);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const docRef = doc(db, "noticias", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNoticia({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error al cargar noticia:", error);
            }
        };
        fetchNoticia();
    }, [id]);

    if (!noticia) {
        return <p className="cargando">Cargando noticia...</p>;
    }

    return (
        <div className="detalle-container">
            {noticia.imagenUrl && (
                <img
                    src={noticia.imagenUrl}
                    alt={noticia.titulo}
                    className="detalle-imagen"
                />
            )}

            <h1>{noticia.titulo}</h1>
            <h3 className="detalle-subtitulo">{noticia.subtitulo}</h3>
            <small className="detalle-fecha">
                {noticia.fechaCreacion
                    ? noticia.fechaCreacion.toDate().toLocaleDateString()
                    : ""}
            </small>
            <p className="detalle-contenido">{noticia.contenido}</p>
            <p className="detalle-autor">
                ✍️ <strong>{noticia.autor || "Autor desconocido"}</strong>
            </p>
            <button className="volver-btn" onClick={() => navigate("/noticias")}>
                Volver
            </button>
        </div>
    );
};

export default NoticiaDetalle;
