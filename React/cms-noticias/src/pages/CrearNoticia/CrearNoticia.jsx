import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import "./CrearNoticia.css";

function CrearNoticia({ modo = "crear" }) {
    const { user, role } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [categoria, setCategoria] = useState("");
    const [imagen, setImagen] = useState(null);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const catSnapshot = await getDocs(collection(db, "categorias"));
            const cats = catSnapshot.docs.map(doc => doc.data().nombre);
            setCategoriasDisponibles(cats);
        };

        fetchCategorias();

        // Si estamos en modo edición, cargar noticia
        if (modo === "editar" && id) {
            const fetchNoticia = async () => {
                const docRef = doc(db, "noticias", id);
                const noticiaSnap = await getDoc(docRef);
                if (noticiaSnap.exists()) {
                    const data = noticiaSnap.data();
                    setTitulo(data.titulo);
                    setSubtitulo(data.subtitulo);
                    setContenido(data.contenido);
                    setCategoria(data.categoria);
                }
            };
            fetchNoticia();
        }
    }, [modo, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imagenUrl = "";

            if (imagen) {
                const storageRef = ref(storage, `noticias/${imagen.name}-${Date.now()}`);
                await uploadBytes(storageRef, imagen);
                imagenUrl = await getDownloadURL(storageRef);
            }

            if (modo === "editar") {
                const docRef = doc(db, "noticias", id);
                await updateDoc(docRef, {
                    titulo,
                    subtitulo,
                    contenido,
                    categoria,
                    ...(imagenUrl && { imagenUrl }),
                    fechaActualizacion: serverTimestamp(),
                });
                alert("Noticia actualizada con éxito!");
            } else {
                await addDoc(collection(db, "noticias"), {
                    titulo,
                    subtitulo,
                    contenido,
                    categoria,
                    imagenUrl,
                    autor: user.nombre,
                    fechaCreacion: serverTimestamp(),
                    fechaActualizacion: serverTimestamp(),
                    estado: role === "reportero" ? "Edición" : "Publicado",
                });
                alert("Noticia creada con éxito!");
            }

            navigate("/noticias");
        } catch (error) {
            console.error("Error al guardar noticia:", error);
            alert("Hubo un error al guardar la noticia.");
        }
    };

    return (
        <div className="crear-noticia-container">
            <h2>{modo === "editar" ? "Editar Noticia" : "Crear nueva noticia"}</h2>
            <form onSubmit={handleSubmit} className="crear-noticia-form">
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Subtítulo"
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                />
                <textarea
                    placeholder="Contenido"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    rows={6}
                    required
                />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                    <option value="">Selecciona una categoría</option>
                    {categoriasDisponibles.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
                <button type="submit">
                    {modo === "editar" ? "Actualizar Noticia" : role === "reportero" ? "Guardar como Edición" : "Publicar Noticia"}
                </button>
            </form>
        </div>
    );
}

export default CrearNoticia;
