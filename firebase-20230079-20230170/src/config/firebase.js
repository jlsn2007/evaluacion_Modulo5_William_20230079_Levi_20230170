import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID 
} from "@env";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAElb5wNNk8F6qOgcrhc5KkrQCgskjB6mg",
  authDomain: "evaluacion-firebase-20230170.firebaseapp.com",
  projectId: "evaluacion-firebase-20230170",
  storageBucket: "evaluacion-firebase-20230170.firebasestorage.app",
  messagingSenderId: "1061393147567",
  appId: "1:1061393147567:web:6883c5dc3f549cb339965a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const database = getFirestore(app);

// Inicializar Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializar Storage
const storage = getStorage(app);

export { app, auth, database, storage };
