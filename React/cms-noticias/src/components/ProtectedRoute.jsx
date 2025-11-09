import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roleRequired }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    if (!user) return <Navigate to="/login" />;

    if (roleRequired) {
        // Si es un string, lo convertimos a arreglo
        const rolesPermitidos = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

        if (!rolesPermitidos.includes(role)) {
            // Usuario autenticado pero sin rol permitido → redirige a home
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default ProtectedRoute;
