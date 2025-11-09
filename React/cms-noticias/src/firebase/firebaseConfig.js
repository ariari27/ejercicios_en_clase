// Importa las funciones principales de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUJ3uovKExiD7PB6_JTrI8EB8f5XrMs1s",
  authDomain: "web-2025-5f75e.firebaseapp.com",
  projectId: "web-2025-5f75e",
  storageBucket: "web-2025-5f75e.firebasestorage.app",
  messagingSenderId: "30960746795",
  appId: "1:30960746795:web:784458725a28f12d45056e",
  measurementId: "G-LW0R83SVGF"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage= getStorage(app);

// Exporta la app para posibles usos
export default app;
