import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
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
        // Garante que o id é um número
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando cliente...</Text>
      </View>
    );
  }

  if (error || !cliente) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Cliente não encontrado'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cliente</Text>
      <ClienteForm cliente={cliente} onSave={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText:{
    color: 'red',
    fontSize: 16,
  }
});