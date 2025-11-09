import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ajusta la ruta si tu contexto está en otra carpeta
import "./Login.css";

function Login() {
    const { login } = useAuth(); // función del contexto
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password); // autenticación Firebase
            navigate("/"); // redirige al inicio o al dashboard
        } catch (err) {
            console.error(err);
            if (err.code === "auth/invalid-credential") {
                setError("Credenciales inválidas. Verifica tu correo y contraseña.");
            } else if (err.code === "auth/user-not-found") {
                setError("Usuario no encontrado. Regístrate primero.");
            } else if (err.code === "auth/wrong-password") {
                setError("Contraseña incorrecta.");
            } else {
                setError("Error al iniciar sesión. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@ejemplo.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        required
                    />
                </div>

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
