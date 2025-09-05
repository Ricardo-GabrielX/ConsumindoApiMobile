// components/ConnectionDebug.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { apiService } from '../services/api';

export default function ConnectionDebug() {
  const [ip, setIp] = useState('192.168.1.100');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setTesting(true);
    try {
      // Testa a conexão com o IP atual
      const testUrl = `http://${ip}:3000/`;
      console.log('Testing connection to:', testUrl);
      
      const response = await fetch(testUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(`✅ Conexão bem-sucedida! Encontrados ${data.length} clientes.`);
      console.log('Connection successful:', data);
    } catch (error: any) {
      setResult(`❌ Erro na conexão: ${error.message || error}`);
      console.error('Connection failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug de Conexão</Text>
      
      <Text style={styles.label}>IP do backend:</Text>
      <TextInput
        placeholder="Ex: 192.168.1.100"
        value={ip}
        onChangeText={setIp}
        style={styles.input}
      />
      
      <TouchableOpacity 
        style={[styles.button, testing && styles.buttonDisabled]} 
        onPress={testConnection}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testando...' : 'Testar Conexão'}
        </Text>
      </TouchableOpacity>
      
      {result ? (
        <Text style={[styles.result, result.includes('✅') ? styles.success : styles.error]}>
          {result}
        </Text>
      ) : null}
      
      <Text style={styles.tip}>
        💡 Dica: Verifique se o backend está rodando e se o IP está correto.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    fontWeight: '500',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderColor: '#f5c6cb',
  },
  tip: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});