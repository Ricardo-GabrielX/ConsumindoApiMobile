import { useState, useEffect } from 'react';
import { Cliente, apiService } from '../services/api';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getClientes();
      console.log('Clientes carregados:', data); // Debug
      setClientes(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao carregar clientes';
      setError(errorMsg);
      console.error('Erro no useClientes:', err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarCliente = async (cliente: Omit<Cliente, 'id'>) => {
    try {
      await apiService.createCliente(cliente);
      await carregarClientes();
    } catch (err) {
      setError('Erro ao adicionar cliente');
      throw err;
    }
  };

  const atualizarCliente = async (id: number, cliente: Omit<Cliente, 'id'>) => {
    try {
      await apiService.updateCliente(id, cliente);
      await carregarClientes();
    } catch (err) {
      setError('Erro ao atualizar cliente');
      throw err;
    }
  };

  const deletarCliente = async (id: number): Promise<boolean> => {
    try {
      console.log('Tentando deletar cliente ID:', id);
      const response = await apiService.deleteCliente(id);
      
      console.log('Resposta do delete:', response);
      
      // A resposta agora é um objeto { success: boolean, message: string }
      if (response && response.success) {
        console.log('Cliente deletado com sucesso');
        return true;
      } else {
        throw new Error(response?.message || 'Falha ao deletar cliente');
      }
    } catch (err: any) {
      console.error('Erro ao deletar cliente:', err);
      const errorMsg = err.message || 'Erro ao deletar cliente';
      setError(errorMsg);
      throw err;
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    carregarClientes,
    adicionarCliente,
    atualizarCliente,
    deletarCliente,
  };
};