import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, database } from "../config/firebase";

const RegisterScreen = ({ navigation }) => {
  // Estados para almacenar los datos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [titulo, setTitulo] = useState("");
  const [anioGraduacion, setAnioGraduacion] = useState("");

  const handleRegister = async () => {
    // Validación: verificar que todos los campos estén completos
    if (!nombre || !email || !password || !titulo || !anioGraduacion) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      // Crear usuario en Firebase Authentication con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Obtener datos del usuario creado

      // Guardar información adicional del usuario en Firestore
      await setDoc(doc(database, "users", user.uid), {
        uid: user.uid,
        nombre,
        correo: email,
        titulo,
        anioGraduacion,
      });

      // Mostrar mensaje de éxito y redirigir al login
      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente");
      navigation.navigate("Login");
    } catch (error) {
      // Manejar errores durante el registro
      console.log(error);
      Alert.alert("Error al registrar", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      {/* Campo de entrada para el nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      
      {/* Campo para email con teclado específico y sin autocapitalización */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Campo para contraseña con texto oculto */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Campo para título universitario */}
      <TextInput
        style={styles.input}
        placeholder="Título universitario"
        value={titulo}
        onChangeText={setTitulo}
      />
      
      {/* Campo para año con teclado numérico */}
      <TextInput
        style={styles.input}
        placeholder="Año de graduación"
        value={anioGraduacion}
        onChangeText={setAnioGraduacion}
        keyboardType="numeric"
      />

      {/* Botón principal para registrar usuario */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Link para navegar a la pantalla de login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

// Estilos para los componentes de la interfaz
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
});