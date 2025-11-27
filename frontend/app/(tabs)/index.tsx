import React from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, 
  ScrollView, RefreshControl, StatusBar, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useClientes } from '../../hooks/useClientes';
import DeleteModal from '../../components/DeleteModal';
import { apiService } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native'; // ⬅️ IMPORTANTE

export default function HomeScreen() {
  const router = useRouter();
  const { clientes, loading, error, carregarClientes } = useClientes();
  const [refreshing, setRefreshing] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [clienteToDelete, setClienteToDelete] = React.useState<{id: number, nome: string} | null>(null);

  // ⬅️ useFocusEffect para recarregar ao voltar para a tela
  useFocusEffect(
    React.useCallback(() => {
      carregarClientes();
    }, [])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await carregarClientes();
    setRefreshing(false);
  }, []);
  
  const handleDeleteClick = (id: number | undefined, nome: string) => {
    if (!id) return;
    setClienteToDelete({ id, nome });
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;
    
    try {
      await apiService.deleteCliente(clienteToDelete.id);
      Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
      await carregarClientes();
    } catch (error: any) {
      console.error('Erro delete:', error);
      Alert.alert('Erro', 'Não foi possível excluir. Verifique a conexão com o backend.');
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
    if (!id) return;
    router.push({ pathname: '/clientes/[id]', params: { id: id.toString() } } as any);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C851" />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00C851" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00C851']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{clientes.length}</Text>
            <Text style={styles.statLabel}>Clientes Cadastrados</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ Erro de Conexão</Text>
            <Text style={styles.errorText}>
              Não foi possível conectar ao servidor. Verifique se o IP no backend e no arquivo api.ts são iguais.
            </Text>
          </View>
        )}

        {clientes.length === 0 && !error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Nenhum cliente</Text>
            <TouchableOpacity onPress={carregarClientes} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>🔄 Recarregar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.clientesContainer}>
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
                  </View>
                </View>
                
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={() => handleEdit(item.id)} 
                    style={[styles.actionButton, styles.editButton]}
                  >
                    <Text style={styles.actionButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDeleteClick(item.id, item.Nome)} 
                    style={[styles.actionButton, styles.deleteButton]}
                  >
                    <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  scrollContent: { padding: 20 },
  statsContainer: { marginBottom: 20 },
  statCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 3 },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#00C851' },
  statLabel: { color: '#666' },
  errorCard: { backgroundColor: '#ffebee', padding: 15, borderRadius: 10, marginBottom: 20 },
  errorTitle: { color: '#c62828', fontWeight: 'bold', marginBottom: 5 },
  errorText: { color: '#c62828' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { fontSize: 50 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  retryButton: { backgroundColor: '#00C851', padding: 10, borderRadius: 20 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  clientesContainer: { paddingBottom: 20 },
  clienteCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  clienteHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#00C851', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  clienteInfo: { flex: 1 },
  clienteNome: { fontSize: 18, fontWeight: 'bold' },
  clienteDetails: { flexDirection: 'row', gap: 15, marginTop: 4 },
  clienteDetail: { color: '#666' },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  editButton: { borderColor: '#00C851', backgroundColor: '#e8f5e9' },
  deleteButton: { borderColor: '#ff4444', backgroundColor: '#ffebee' },
  actionButtonText: { fontWeight: 'bold' }
});
