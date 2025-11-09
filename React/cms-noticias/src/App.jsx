import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Noticias from "./pages/Noticias/Noticias";
import NoticiaDetalle from "./pages/NoticiaDetalle/NoticiaDetalle.jsx";
import CrearNoticia from "./pages/CrearNoticia/CrearNoticia";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/protectedRoute";
import Admin from "./pages/Admin/Admin.jsx";
import DashboardNoticias from "./pages/DashBoard/DashBoardNoticias.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/login" element={<Login />} />

            {/* 🔒 Solo usuarios autenticados pueden acceder */}
            <Route
              path="/crear"
              element={
                <ProtectedRoute>
                  <CrearNoticia />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roleRequired={["reportero", "editor"]}>
                  <DashboardNoticias />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear/:id"
              element={
                <ProtectedRoute>
                  <CrearNoticia modo="editar"/>
                </ProtectedRoute>
              }
            />
            <Route path="/noticia/:id" element={<NoticiaDetalle />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
