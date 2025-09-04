import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Buttons = ({
  children,
  onPress,
  mode = 'contained',
  style,
  textStyle,
  loading = false,
  disabled = false,
  icon,
  iconSize = 20,
  iconColor,
  ...props
}) => {
  // Determine button styles based on mode and state
  const buttonStyles = [
    styles.button,
    mode === 'contained' && styles.contained,
    mode === 'outlined' && styles.outlined,
    mode === 'text' && styles.textButton,
    disabled && styles.disabled,
    style,
  ];

  // Determine text styles based on mode
  const textStyles = [
    styles.text,
    mode === 'contained' && styles.containedText,
    mode === 'outlined' && styles.outlinedText,
    mode === 'text' && styles.textButtonText,
    textStyle,
  ];

  // Determine icon color
  const iconColorResolved = iconColor || 
    (mode === 'contained' ? '#fff' : '#6200ee');

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={mode === 'contained' ? '#fff' : '#6200ee'} 
          size="small"
        />
      ) : (
        <View style={styles.content}>
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
  // Base button styles
  button: {
    minWidth: 64,
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    marginVertical: 5,
  },
  
  // Button variants
  contained: {
    backgroundColor: '#6200ee',
  },
  
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#6200ee',
    elevation: 0,
  },
  
  textButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  
  // Button states
  disabled: {
    opacity: 0.6,
  },
  
  // Content layout
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  
  icon: {
    marginRight: 8,
  },
  
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  containedText: {
    color: '#fff',
  },
  
  outlinedText: {
    color: '#6200ee',
  },
  
  textButtonText: {
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
});

export default Buttons;
