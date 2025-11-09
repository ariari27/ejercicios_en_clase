import React from "react";
import { useNavigate } from "react-router-dom";
import "./NoticiaCard.css";

const NoticiaCard = ({ noticia }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/noticia/${noticia.id}`);
    };

    return (
        <div className="noticia-card" onClick={handleClick}>
            {noticia.imagenUrl && (
                <img
                    src={noticia.imagenUrl}
                    alt={noticia.titulo}
                    className="noticia-imagen"
                />
            )}
            <h3>{noticia.titulo}</h3>
            {noticia.subtitulo && (
                <p className="subtitulo">{noticia.subtitulo}</p>
            )}
            <small>
                {noticia.fechaCreacion
                    ? noticia.fechaCreacion.toDate().toLocaleDateString()
                    : ""}
            </small>
        </div>
    );
};

export default NoticiaCard;
