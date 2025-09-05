export interface Cliente {
  id?: number;
  Nome: string;
  Idade: number;
  UF: string;
}

// Detecta se está no ambiente web
const isWeb = typeof document !== 'undefined';

// Para web, usamos localhost, para dispositivo físico, usamos o IP
const API_BASE_URL = isWeb 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.100:3000'; // Substitua pelo seu IP

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getClientes(): Promise<Cliente[]> {
    try {
      const response = await fetch(`${this.baseURL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  async getClienteById(id: number): Promise<Cliente> {
    try {
      const response = await fetch(`${this.baseURL}/clientes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/clientes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async updateCliente(id: number, cliente: Omit<Cliente, 'id'>): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  async deleteCliente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Status da resposta delete:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Resposta JSON delete:', result);
      
      return result;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/`);
      return response.ok;
    } catch (error) {
      console.error('Erro de conexão:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();