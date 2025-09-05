import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Componente de botón reutilizable que acepta múltiples props para personalización
const Buttons = ({
 children,
 onPress,
 mode = 'contained', // Modo por defecto: botón sólido
 style,
 textStyle,
 loading = false,
 disabled = false,
 icon,
 iconSize = 20,
 iconColor,
 ...props
}) => {
 // Combina estilos base con estilos específicos según el modo y estado del botón
 const buttonStyles = [
   styles.button,
   mode === 'contained' && styles.contained, // Botón sólido con fondo
   mode === 'outlined' && styles.outlined,   // Botón con borde y fondo transparente
   mode === 'text' && styles.textButton,     // Botón de solo texto
   disabled && styles.disabled,              // Aplica opacidad reducida si está deshabilitado
   style,
 ];

 // Define estilos de texto según el modo del botón
 const textStyles = [
   styles.text,
   mode === 'contained' && styles.containedText, // Texto blanco para botón sólido
   mode === 'outlined' && styles.outlinedText,   // Texto morado para botón con borde
   mode === 'text' && styles.textButtonText,     // Texto subrayado para botón de texto
   textStyle,
 ];

 // Determina el color del icono basado en el modo del botón
 const iconColorResolved = iconColor || 
   (mode === 'contained' ? '#fff' : '#6200ee');

 return (
   <TouchableOpacity
     style={buttonStyles}
     onPress={onPress}
     disabled={disabled || loading} // Deshabilita el botón si está en estado loading o disabled
     activeOpacity={0.8}
     {...props}
   >
     {loading ? (
       // Muestra indicador de carga en lugar del contenido cuando loading es true
       <ActivityIndicator 
         color={mode === 'contained' ? '#fff' : '#6200ee'} 
         size="small"
       />
     ) : (
       <View style={styles.content}>
         {/* Renderiza icono opcional antes del texto */}
         {icon && (
           <MaterialIcons 
             name={icon} 
             size={iconSize} 
             color={iconColorResolved} 
             style={styles.icon} 
           />
         )}
         {children && <Text style={textStyles}>{children}</Text>}
       </View>
     )}
   </TouchableOpacity>
 );
};

const styles = StyleSheet.create({
 // Estilos base compartidos por todos los tipos de botón
 button: {
   minWidth: 64,
   minHeight: 42,
   paddingHorizontal: 16,
   borderRadius: 8,
   justifyContent: 'center',
   alignItems: 'center',
   flexDirection: 'row',
   elevation: 2, // Sombra en Android
   shadowColor: '#000', // Sombra en iOS
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.15,
   shadowRadius: 3.5,
   marginVertical: 5,
 },
 
 // Botón sólido con fondo morado
 contained: {
   backgroundColor: '#6200ee',
 },
 
 // Botón con borde y fondo transparente
 outlined: {
   backgroundColor: 'transparent',
   borderWidth: 1.5,
   borderColor: '#6200ee',
   elevation: 0, // Sin sombra para botón outlined
 },
 
 // Botón de solo texto sin fondo ni borde
 textButton: {
   backgroundColor: 'transparent',
   elevation: 0,
   shadowOpacity: 0, // Sin sombra
 },
 
 disabled: {
   opacity: 0.6, // Reduce opacidad cuando está deshabilitado
 },
 
 // Layout para organizar icono y texto horizontalmente
 content: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   paddingVertical: 8,
 },
 
 icon: {
   marginRight: 8, // Espaciado entre icono y texto
 },
 
 text: {
   fontSize: 16,
   fontWeight: '500',
   textAlign: 'center',
 },
 
 // Texto blanco para botones sólidos
 containedText: {
   color: '#fff',
 },
 
 // Texto morado para botones con borde
 outlinedText: {
   color: '#6200ee',
 },
 
 // Texto subrayado para botones de texto
 textButtonText: {
   color: '#6200ee',
   textDecorationLine: 'underline',
 },
});

export default Buttons;