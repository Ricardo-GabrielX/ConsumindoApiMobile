import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClienteForm from '../../components/ClienteForm';

export default function NovoClienteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Cliente</Text>
      <ClienteForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});