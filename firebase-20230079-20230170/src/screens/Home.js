import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, TextInput } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Buttons from '../components/Buttons';

// Simple card component replacement
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

// Simple text input replacement
const CustomTextInput = ({ 
  label, 
  value, 
  onChangeText, 
  style, 
  mode = 'outlined',
  multiline = false,
  numberOfLines = 1,
  ...props 
}) => (
  <View style={[styles.inputContainer, style]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={[
      styles.input, 
      mode === 'outlined' && styles.outlinedInput,
      multiline && styles.multilineInput
    ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.inputText,
          multiline && { textAlignVertical: 'top' }
        ]}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        {...props}
      />
    </View>
  </View>
);

// Simple avatar component
const Avatar = ({ label, size = 40, style }) => {
  const firstLetter = label ? label.charAt(0).toUpperCase() : 'U';
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={styles.avatarText}>{firstLetter}</Text>
    </View>
  );
};

export default function Home({ navigation }) {
  const { user, logout, updateUser, deleteUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false); // AGREGADO: estado para saving
  const [formData, setFormData] = useState({
    displayName: '',
    titulo: '',
    anioGraduacion: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.name || user.displayName || 'No especificado',
        titulo: user.titulo || 'No especificado',
        anioGraduacion: user.anioGraduacion || 'No especificado'
      });
    }
  }, [user]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para guardar los datos del perfil
  const handleSave = async () => {
    try {
      setSaving(true);
      // Mapear los nombres de los campos correctamente
      const userData = {
        name: formData.displayName,  // Mapear displayName a name
        titulo: formData.titulo,
        anioGraduacion: formData.anioGraduacion
      };
      
      await updateUser(userData);
      setEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    } finally {
      setSaving(false);
    }
  };

  const handleLogOut = async () => {
    const result = await logout();
    if (!result.success) {
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando datos del perfil...</Text>
      </View>
    );
  }

  const renderField = (label, value, fieldName, multiline = false, readOnly = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {editing && !readOnly ? (
        <CustomTextInput
          value={value}
          onChangeText={(text) => handleChange(fieldName, text)}
          style={styles.input}
          mode="outlined"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar 
              label={formData.displayName && formData.displayName !== 'No especificado' ? '✓' : 'U'}
              size={80}
            />
          </View>
          <Text style={styles.userName}>
            {formData.displayName !== 'No especificado' ? formData.displayName : 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            {renderField('Correo electrónico', user.email || 'No especificado', 'email', false, true)}
            {renderField('Nombre completo', formData.displayName, 'displayName')}
            {renderField('Título universitario', formData.titulo, 'titulo', true)}
            {renderField('Año de graduación', formData.anioGraduacion, 'anioGraduacion')}

            <View style={styles.buttonGroup}>
              {editing ? (
                <View style={styles.editButtonsContainer}>
                  <Buttons
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    loading={saving}
                    icon="check"
                  >
                    Guardar Cambios
                  </Buttons>
                  <Buttons
                    mode="outlined"
                    onPress={() => setEditing(false)}
                    style={styles.cancelButton}
                    disabled={saving}
                    textStyle={styles.cancelButtonText}
                    icon="close"
                  >
                    Cancelar
                  </Buttons>
                </View>
              ) : (
                <Buttons
                  mode="contained"
                  onPress={() => setEditing(true)}
                  style={styles.editButton}
                  icon="check"
                >
                  Editar perfil
                </Buttons>
              )}
            </View>
          </View>
        </Card>

        <Card style={[styles.profileCard, styles.dangerZone]}>
          <View style={styles.cardContent}>
            <Text style={styles.dangerZoneTitle}>Zona de peligro</Text>
            <Text style={styles.dangerZoneText}>
              Estas acciones no se pueden deshacer. Ten cuidado.
            </Text>
            
            <View style={styles.dangerButtons}>
              <Buttons
                mode="outlined"
                onPress={handleLogOut}
                style={styles.logoutButton}
                textStyle={styles.logoutButtonText}
                icon="logout"
              >
                Cerrar sesión
              </Buttons>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  card: {
    margin: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCard: {
    margin: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  outlinedInput: {
    borderColor: '#6200ee',
    borderWidth: 1.5,
  },
  multilineInput: {
    minHeight: 100,
    paddingVertical: 12,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  valueContainer: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    marginTop: 16,
    flexDirection: 'column',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#6200ee',
    alignSelf: 'flex-start',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    flex: 1,
  },
  cancelButton: {
    borderColor: '#6200ee',
    flex: 1,
  },
  cancelButtonText: {
    color: '#6200ee',
  },
  dangerZone: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff3d00',
    marginTop: 20,
  },
  dangerZoneTitle: {
    color: '#ff3d00',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  dangerZoneText: {
    color: '#666',
    fontSize: 13,
    marginBottom: 15,
  },
  dangerButtons: {
    marginTop: 10,
    gap: 10,
  },
  logoutButton: {
    borderColor: '#ff6d00',
  },
  logoutButtonText: {
    color: '#ff6d00',
  },
  deleteButton: {
    backgroundColor: '#ff3d00',
  },
  deleteButtonText: {
    color: 'white',
  },
});