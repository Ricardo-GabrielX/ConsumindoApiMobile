import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import ClienteForm from '../../components/ClienteForm';

export default function NovoClienteScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00C851" />
      
      <View style={styles.formContainer}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeIcon}>🚀</Text>
          <Text style={styles.welcomeTitle}>Vamos começar!</Text>
          <Text style={styles.welcomeText}>
            Preencha os dados abaixo para cadastrar um novo cliente
          </Text>
        </View>
        
        <ClienteForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
});