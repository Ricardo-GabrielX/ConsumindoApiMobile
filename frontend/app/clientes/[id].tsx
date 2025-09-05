import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ClienteForm from '../../components/ClienteForm';
import { Cliente, apiService } from '../../services/api';

export default function EditarClienteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        const clienteId = typeof id === 'string' ? parseInt(id, 10) : Number(id);
       
        if (isNaN(clienteId)) {
          throw new Error('ID inválido');
        }
        console.log('Carregando cliente ID:', clienteId);
        const data = await apiService.getClienteById(clienteId);
       
        if (!data) {
          throw new Error('Cliente não encontrado');
        }
       
        setCliente(data);
      } catch (error: any) {
        console.error('Erro ao carregar cliente:', error);
        setError(error.message || 'Erro ao carregar cliente');
        Alert.alert('Erro', 'Não foi possível carregar o cliente');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      carregarCliente();
    } else {
      setError('ID não fornecido');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#00C851" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#00C851" />
            <Text style={styles.loadingText}>Carregando dados do cliente...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error || !cliente) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#00C851" />
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
            <Text style={styles.errorText}>{error || 'Cliente não encontrado'}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00C851" />
      
      <View style={styles.formContainer}>
        <View style={styles.clienteHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {cliente.Nome ? cliente.Nome.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.clienteInfo}>
            <Text style={styles.clienteSubtitle}>Editando Cliente</Text>
            <Text style={styles.clienteNome}>{cliente.Nome}</Text>
          </View>
        </View>
        
        <ClienteForm cliente={cliente} onSave={() => router.back()} />
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
  clienteHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00C851',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteSubtitle: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  clienteNome: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 300,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});