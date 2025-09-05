import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useClientes } from '../../hooks/useClientes';
import ConnectionDebug from '../../components/ConnectionDebug';
import DeleteModal from '../../components/DeleteModal'; // Importe o modal

const { width } = Dimensions.get('window');
const isWeb = width > 768;

export default function HomeScreen() {
  const router = useRouter();
  const { clientes, loading, error, deletarCliente, carregarClientes } = useClientes();
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [clienteToDelete, setClienteToDelete] = React.useState<{id: number, nome: string} | null>(null);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await carregarClientes();
    setRefreshing(false);
  }, []);
  
  const handleDeleteClick = (id: number | undefined, nome: string) => {
    if (!id) {
      return;
    }
    setClienteToDelete({ id, nome });
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;

    console.log('=== INICIANDO DELETE ===');
    console.log('ID para deletar:', clienteToDelete.id);
    
    try {
      console.log('Fazendo fetch diretamente...');
      const response = await fetch(`http://localhost:3000/clientes/${clienteToDelete.id}`, {
        method: 'DELETE',
      });
      
      console.log('Status da resposta:', response.status);
      const result = await response.json();
      console.log('Resposta JSON:', result);
      
      if (response.ok) {
        // Mensagem de sucesso usando alert (funciona na web)
        alert('Cliente deletado com sucesso!');
        await carregarClientes();
      } else {
        alert(result.message || 'Falha ao deletar');
      }
      
    } catch (error: any) {
      console.error('Erro no delete direto:', error);
      alert(error.message || 'Erro ao deletar cliente');
    } finally {
      setDeleteModalVisible(false);
      setClienteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setClienteToDelete(null);
  };

  const handleEdit = (id: number | undefined) => {
    if (!id) {
      alert('ID do cliente não encontrado');
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
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#00C851" />
          <Text style={styles.loadingText}>Carregando clientes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00C851" />

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#00C851']}
            tintColor="#00C851"
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Estatísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{clientes.length}</Text>
            <Text style={styles.statLabel}>Total de Clientes</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ Erro de Conexão</Text>
            <Text style={styles.errorText}>{error}</Text>
            <ConnectionDebug />
          </View>
        )}

        {clientes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Nenhum cliente cadastrado</Text>
            <Text style={styles.emptySubtitle}>Comece adicionando seu primeiro cliente</Text>
            <TouchableOpacity onPress={carregarClientes} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>🔄 Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.clientesContainer}>
            <Text style={styles.sectionTitle}>Seus Clientes</Text>
            {clientes.map((item) => (
              <View key={item.id || Math.random()} style={styles.clienteCard}>
                <View style={styles.clienteHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {item.Nome ? item.Nome.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </View>
                  <View style={styles.clienteInfo}>
                    <Text style={styles.clienteNome}>{item.Nome}</Text>
                    <View style={styles.clienteDetails}>
                      <Text style={styles.clienteDetail}>🎂 {item.Idade} anos</Text>
                      <Text style={styles.clienteDetail}>📍 {item.UF}</Text>
                    </View>
                    {!item.id && (
                      <Text style={styles.idWarning}>⚠️ ID não disponível</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={() => handleEdit(item.id)} 
                    style={[styles.actionButton, styles.editButton]}
                    disabled={!item.id}
                  >
                    <Text style={[styles.actionButtonText, !item.id && styles.buttonDisabled]}>
                      ✏️ Editar
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDeleteClick(item.id, item.Nome)} 
                    style={[styles.actionButton, styles.deleteButton]}
                    disabled={!item.id}
                  >
                    <Text style={[styles.actionButtonText, !item.id && styles.buttonDisabled]}>
                      🗑️ Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        clienteNome={clienteToDelete?.nome || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00C851',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#fff5f5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 8,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#9f7aea',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#00C851',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clientesContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  clienteCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00C851',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clienteDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  clienteDetail: {
    fontSize: 14,
    color: '#666',
  },
  idWarning: {
    color: '#ff8c00',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalClienteName: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalWarning: {
    fontSize: 14,
    color: '#ff8c00',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderBottomRightRadius: 20,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});