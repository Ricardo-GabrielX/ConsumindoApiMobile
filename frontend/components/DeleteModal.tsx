// components/DeleteModal.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet 
} from 'react-native';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clienteNome: string;
}

export default function DeleteModal({ 
  visible, 
  onClose, 
  onConfirm, 
  clienteNome 
}: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>🗑️</Text>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Tem certeza que deseja excluir o cliente{' '}
              <Text style={styles.modalClienteName}>{clienteNome}</Text>?
            </Text>
            <Text style={styles.modalWarning}>
              ⚠️ Esta ação não pode ser desfeita!
            </Text>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onConfirm}
              style={styles.modalDeleteButton}
            >
              <Text style={styles.modalDeleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FF3B30',
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