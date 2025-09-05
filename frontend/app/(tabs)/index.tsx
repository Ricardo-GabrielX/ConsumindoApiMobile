import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useClientes } from '../../hooks/useClientes';
import ConnectionDebug from '../../components/ConnectionDebug';

export default function HomeScreen() {
  const router = useRouter();
  const { clientes, loading, error, deletarCliente, carregarClientes } = useClientes();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await carregarClientes();
    setRefreshing(false);
  }, []);
  
    const handleDelete = async (id: number | undefined) => {
    if (!id) {
      Alert.alert('Erro', 'ID do cliente não encontrado');
      return;
    }

    console.log('=== INICIANDO DELETE ===');
    console.log('ID para deletar:', id);
    
    try {
    
      console.log('Fazendo fetch diretamente...');
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE',
      });
      
      console.log('Status da resposta:', response.status);
      const result = await response.json();
      console.log('Resposta JSON:', result);
      
      if (response.ok) {
        Alert.alert('Sucesso!', 'Cliente deletado com sucesso');
    
        await carregarClientes();
      } else {
        Alert.alert('Erro', result.message || 'Falha ao deletar');
      }
      
    } catch (error: any) {
      console.error('Erro no delete direto:', error);
      Alert.alert('Erro', error.message || 'Erro ao deletar cliente');
    }
  };

  // Adicione esta função temporária no index.tsx
  const testDeleteManual = async () => {
    try {
      console.log('=== TESTE MANUAL DELETE ===');
      const response = await fetch('http://localhost:3000/clientes/1', {
        method: 'DELETE',
      });
      console.log('Status:', response.status);
      const data = await response.json();
      console.log('Resposta:', data);
      Alert.alert('Teste', `Status: ${response.status}, Resposta: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Erro no teste manual:', error);
      Alert.alert('Erro', 'Falha no teste manual');
    }
  };

  // Adicione este botão temporário no JSX:
  {/* Botão temporário para teste */}
  <TouchableOpacity 
    onPress={testDeleteManual} 
    style={[ {backgroundColor: 'purple', marginTop: 10}]}
  >
    <Text style={styles.buttonText}>Teste Manual Delete</Text>
  </TouchableOpacity>

  const handleEdit = (id: number | undefined) => {
    if (!id) {
      Alert.alert('Erro', 'ID do cliente não encontrado');
      return;
    }
    
    router.push({
      pathname: '/clientes/[id]',
      params: { id: id.toString() }
    } as any);
  };

  const handleAdd = () => {
    router.push('/clientes/novo');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Novo Cliente</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {error && (
          <View style={styles.debugContainer}>
            <Text style={styles.errorText}>Erro: {error}</Text>
            <ConnectionDebug />
          </View>
        )}

        {clientes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text>Nenhum cliente cadastrado.</Text>
            <TouchableOpacity onPress={carregarClientes} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          clientes.map((item) => (
            <View key={item.id || Math.random()} style={styles.clienteCard}>
              <View style={styles.clienteInfo}>
                <Text style={styles.clienteNome}>{item.Nome}</Text>
                <Text>Idade: {item.Idade}</Text>
                <Text>UF: {item.UF}</Text>
                {!item.id && <Text style={styles.idWarning}>⚠️ ID não disponível</Text>}
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => handleEdit(item.id)} 
                  style={styles.editButton}
                  disabled={!item.id}
                >
                  <Text style={[styles.buttonText, !item.id && styles.buttonDisabled]}>
                    Editar
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)} 
                  style={styles.deleteButton}
                  disabled={!item.id}
                >
                  <Text style={[styles.buttonText, !item.id && styles.buttonDisabled]}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clienteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 2, 
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  idWarning: {
    color: 'orange',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FF9500',
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  buttonDisabled: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  retryButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  debugContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff8f8',
    borderWidth: 1,
    borderColor: '#ffcccc',
    borderRadius: 8,
  },
});