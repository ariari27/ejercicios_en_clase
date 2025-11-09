import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import "./Admin.css";

function Admin() {
    // Usuarios
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("reportero");
    const [nombre, setNombre] = useState(""); // 🟢 nuevo campo para nombre

    // Categorías
    const [categorias, setCategorias] = useState([]);
    const [nombreCat, setNombreCat] = useState("");
    const [descripcionCat, setDescripcionCat] = useState("");
    const [editarCatId, setEditarCatId] = useState(null);

    const auth = getAuth();

    // 🔹 Cargar usuarios
    const fetchUsers = async () => {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // 🔹 Cargar categorías
    const fetchCategorias = async () => {
        const catCollection = collection(db, "categorias");
        const snapshot = await getDocs(catCollection);
        setCategorias(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchUsers();
        fetchCategorias();
    }, []);

    // ➕ Crear usuario
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), { email, role, nombre }); // 🟢 guarda también nombre

            alert("Usuario creado con éxito");
            setEmail("");
            setPassword("");
            setRole("reportero");
            setNombre("");
            fetchUsers();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            alert("Error al crear usuario");
        }
    };

    // 🗑️ Eliminar usuario (sin tocar admin)
    const handleDeleteUser = async (id, rol) => {
        if (rol === "admin") {
            alert("No se puede eliminar al admin");
            return;
        }
        try {
            await deleteDoc(doc(db, "users", id));
            alert("Usuario eliminado");
            fetchUsers();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    // 🔄 Actualizar rol
    const handleRoleChange = async (id, newRole) => {
        try {
            await updateDoc(doc(db, "users", id), { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    // ✏️ Actualizar nombre
    const handleNombreChange = async (id, newName) => {
        try {
            await updateDoc(doc(db, "users", id), { nombre: newName });
            fetchUsers();
        } catch (error) {
            console.error("Error al actualizar nombre:", error);
        }
    };

    // ➕ Crear o actualizar categoría
    const handleCategoriaSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editarCatId) {
                await updateDoc(doc(db, "categorias", editarCatId), { nombre: nombreCat, descripcion: descripcionCat });
                setEditarCatId(null);
            } else {
                const newCatDoc = doc(collection(db, "categorias"));
                await setDoc(newCatDoc, { nombre: nombreCat, descripcion: descripcionCat });
            }
            setNombreCat("");
            setDescripcionCat("");
            fetchCategorias();
        } catch (error) {
            console.error(error);
        }
    };

    // 📝 Editar categoría
    const handleEditCategoria = (cat) => {
        setEditarCatId(cat.id);
        setNombreCat(cat.nombre);
        setDescripcionCat(cat.descripcion);
    };

    // 🗑️ Eliminar categoría si no tiene noticias asociadas
    const handleDeleteCategoria = async (cat) => {
        try {
            const noticiasQuery = query(collection(db, "noticias"), where("categoria", "==", cat.nombre));
            const snapshot = await getDocs(noticiasQuery);
            if (!snapshot.empty) {
                alert("No se puede eliminar: esta categoría tiene noticias asociadas");
                return;
            }
            await deleteDoc(doc(db, "categorias", cat.id));
            fetchCategorias();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Panel de Administración</h2>

            {/* 🧑‍💻 Usuarios */}
            <form className="admin-form" onSubmit={handleCreateUser}>
                <h3>Crear nuevo usuario</h3>
                <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required /> {/* 🟢 nuevo campo */}
                <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="reportero">Reportero</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                </select>
                <button type="submit">Crear usuario</button>
            </form>

            <h3>Usuarios registrados</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>
                                <input
                                    type="text"
                                    value={u.nombre || ""}
                                    onChange={e => handleNombreChange(u.id, e.target.value)} // 🟢 editable en vivo
                                    placeholder="Sin nombre"
                                />
                            </td>
                            <td>{u.email}</td>
                            <td>
                                <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                                    <option value="reportero">Reportero</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteUser(u.id, u.role)}
                                    disabled={u.role === "admin"}
                                >
                                    {u.role === "admin" ? "Admin" : "Eliminar"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 📂 Categorías */}
            <form className="admin-form" onSubmit={handleCategoriaSubmit}>
                <h3>{editarCatId ? "Editar categoría" : "Crear nueva categoría"}</h3>
                <input type="text" placeholder="Nombre" value={nombreCat} onChange={e => setNombreCat(e.target.value)} required />
                <input type="text" placeholder="Descripción" value={descripcionCat} onChange={e => setDescripcionCat(e.target.value)} required />
                <button type="submit">{editarCatId ? "Actualizar categoría" : "Crear categoría"}</button>
            </form>

            <h3>Categorías existentes</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map(cat => (
                        <tr key={cat.id}>
                            <td>{cat.nombre}</td>
                            <td>{cat.descripcion}</td>
                            <td>
                                <button onClick={() => handleEditCategoria(cat)}>Editar</button>
                                <button onClick={() => handleDeleteCategoria(cat)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;
