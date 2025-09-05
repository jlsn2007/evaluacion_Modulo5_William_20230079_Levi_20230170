import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Buttons from '../components/Buttons';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/lgsoft.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Gestiona tu perfil académico de manera sencilla</Text>
      </View>
      
      <View style={styles.footer}>
        <Buttons
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
          icon="arrow-right"
        >
          Comenzar
        </Buttons>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  footer: {
    paddingBottom: 50,
  },
  button: {
    width: '100%',
  },
});
