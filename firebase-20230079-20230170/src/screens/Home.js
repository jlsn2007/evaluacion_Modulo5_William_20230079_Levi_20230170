import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Buttons from '../components/Buttons';
import { useAuth } from '../hooks/useAuth'; // tu hook que maneja usuario y logout

export default function Home({ navigation }) {
  const { user, logout, updateUser } = useAuth();

  // Estado local para los inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Cuando el usuario cambia, actualizamos los inputs
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    // Aquí llamas la función de tu hook que actualiza los datos del usuario
    await updateUser({ name, email });
    alert('Datos actualizados correctamente');
  };

  const handleLogOut = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hola {user ? user.name || user.email.split('@')[0] : ''}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Buttons text="Guardar Cambios" action={handleSave} />
      <Buttons text="Cerrar Sesión" action={handleLogOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#A93B3F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});
