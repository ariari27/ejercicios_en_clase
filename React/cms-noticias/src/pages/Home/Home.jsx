import React from "react";
import "./Home.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="home">
            <div className="home-content">
                {!user ? (
                    <>
                        <h1>
                            Bienvenid@ a <span>CORPNEWS</span>
                        </h1>
                        <p>Administra, crea y comparte noticias fácilmente.</p>
                        <button className="home-btn" onClick={() => navigate("/login")}>
                            Iniciar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <h1>
                            Hola, <span>{user.nombre}</span>
                        </h1>
                        <p>
                            Tu rol actual es: <strong>{role}</strong>
                        </p>

                        {role === "admin" && (
                            <p>Tienes acceso total al sistema, incluyendo gestión de usuarios.</p>
                        )}
                        {role === "editor" && (
                            <p>Puedes aprobar, editar o desactivar noticias.</p>
                        )}
                        {role === "reportero" && (
                            <p>Puedes crear y editar tus propias noticias.</p>
                        )}

                        <div className="home-buttons">
                            <button className="home-btn" onClick={() => navigate("/noticias")}>
                                Explorar noticias
                            </button>

                            {role === "admin" && (
                                <button className="home-btn secondary" onClick={() => navigate("/admin")}>
                                    Panel de administración
                                </button>
                            )}

                            <button className="home-btn logout" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
