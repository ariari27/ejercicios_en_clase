import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import NoticiaCard from "../../components/NoticiaCard/NoticiaCard";
import "./Noticias.css";

const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtro, setFiltro] = useState("Todas");

    useEffect(() => {
        const obtenerNoticias = async () => {
            const querySnapshot = await getDocs(collection(db, "noticias"));
            const docs = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(noticia => noticia.estado === "Publicado"); // mostrar solo publicadas
            setNoticias(docs);
        };

        const obtenerCategorias = async () => {
            const catSnapshot = await getDocs(collection(db, "categorias"));
            const cats = catSnapshot.docs.map(doc => doc.data());
            setCategorias([{ nombre: "Todas", descripcion: "Mostrando todas las noticias disponibles" }, ...cats]);
        };

        obtenerNoticias();
        obtenerCategorias();
    }, []);

    // Noticias filtradas
    const noticiasFiltradas = filtro === "Todas"
        ? noticias
        : noticias.filter(noticia => noticia.categoria === filtro);

    return (
        <div className="noticias-page">
            <h2>Noticias</h2>
            <div className="noticias-layout">
                <aside className="noticias-aside">
                    <h3>Filtrar por categoría</h3>
                    <ul>
                        {categorias.map(cat => (
                            <li key={cat.nombre}>
                                <button
                                    className={filtro === cat.nombre ? "activo" : ""}
                                    onClick={() => setFiltro(cat.nombre)}
                                >
                                    {cat.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="noticias-content">
                    {/* encabezado con categoría seleccionada */}
                    <div className="categoria-header">
                        <h2>{filtro === "Todas" ? "Todas las categorías" : filtro}</h2>
                        <p>
                            {
                                categorias.find(cat => cat.nombre === filtro)?.descripcion ||
                                "Explora las últimas noticias publicadas."
                            }
                        </p>
                    </div>

                    {/* lista de noticias */}
                    <div className="noticias-list">
                        {noticiasFiltradas.length > 0 ? (
                            noticiasFiltradas.map(noticia => (
                                <NoticiaCard key={noticia.id} noticia={noticia} />
                            ))
                        ) : (
                            <p>No hay noticias en esta categoría.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Noticias;
