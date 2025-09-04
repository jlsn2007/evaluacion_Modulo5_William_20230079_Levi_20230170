import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
// Importa la función de autenticación de Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const LoginScreen = ({ navigation }) => {
  // Estados para almacenar los datos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Función principal que maneja el proceso de inicio de sesión
  const handleLogin = async () => {
    // Validación básica: verificar que los campos no estén vacíos
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }

    try {
      console.log('Intentando iniciar sesión con:', email);
      
      // Intenta autenticar al usuario con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Inicio de sesión exitoso:', userCredential.user);
      
      // No es necesario hacer nada más aquí, el listener de autenticación en Navigation.js
      // se encargará de la redirección automática
      
    } catch (error) {
      // Log detallado del error para debugging
      console.error('Error en inicio de sesión:', {
        code: error.code,
        message: error.message,
        email: email,
        hasPassword: !!password
      });
      
      let errorMessage = 'Error al iniciar sesión';
      
      // Manejo de errores específicos de Firebase con mensajes amigables
      switch(error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu conexión a Internet e inténtalo de nuevo';
          break;
        default:
          errorMessage = error.message;
      }
      
      // Muestra el error al usuario
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Iniciar Sesión</Text>

      {/* Campo de entrada para el correo electrónico */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"  // Teclado optimizado para emails
        autoCapitalize="none"         // Evita capitalización automática
      />

      {/* Campo de entrada para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry  // Oculta el texto de la contraseña
      />

      {/* Botón principal de inicio de sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Enlace para navegar a la pantalla de registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

// Estilos de la pantalla de login
const styles = StyleSheet.create({
  // Contenedor principal centrado con fondo gris claro
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  // Título principal grande y centrado
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  // Estilo para los campos de entrada con bordes redondeados
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  // Botón principal con fondo azul y texto centrado
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  // Texto del botón en blanco y negrita
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Enlace de registro en azul y centrado
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
});