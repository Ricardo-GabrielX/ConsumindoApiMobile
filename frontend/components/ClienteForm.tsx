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
import { apiService } from '../services/api';
import { Cliente } from '../types/types'; 

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
      
     router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.replace('../(tabs)/index');
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
        maxLength={2}
        autoCapitalize="characters"
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
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#00C851',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});