import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Alert,
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Cliente, apiService } from '../services/api';

interface ClienteFormProps {
  cliente?: Cliente;
  onSave?: () => void;
}

export default function ClienteForm({ cliente, onSave }: ClienteFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(cliente?.Nome || '');
  const [idade, setIdade] = useState(cliente?.Idade ? cliente.Idade.toString() : '');
  const [uf, setUf] = useState(cliente?.UF || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome || !idade || !uf) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (cliente?.id) {
        await apiService.updateCliente(cliente.id, {
          Nome: nome,
          Idade: parseInt(idade),
          UF: uf,
        });
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      } else {
        await apiService.createCliente({
          Nome: nome,
          Idade: parseInt(idade),
          UF: uf,
        });
        Alert.alert('Sucesso', 'Cliente criado com sucesso!');
      }
      
      if (onSave) {
        onSave();
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="UF"
        value={uf}
        onChangeText={setUf}
        style={styles.input}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});