import Constants from 'expo-constants';
import { Platform } from 'react-native';

// --- CONFIGURAÇÃO RÁPIDA PARA AULA ---
// Se não conectar, olhe o terminal do backend e coloque o IP aqui:
const MANUAL_IP = '172.68.1.186'; // <--- EX: Mude isso na aula se precisar!
const PORT = '3000';

export interface Cliente {
  id?: number;
  Nome: string;
  Idade: number;
  UF: string;
}

const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://localhost:${PORT}`;

  // Tenta pegar o IP automaticamente do Expo
  const debuggerHost = Constants.expoConfig?.hostUri;
  const autoIp = debuggerHost?.split(':')[0];

  if (autoIp) {
    console.log('📡 IP Detectado automaticamente:', autoIp);
    return `http://${autoIp}:${PORT}`;
  }

  console.log('⚠️ Usando IP Manual:', MANUAL_IP);
  return `http://${MANUAL_IP}:${PORT}`;
};

const API_BASE_URL = getBaseUrl();

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper para lidar com erros de fetch
  private async handleResponse(response: Response) {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro API: ${response.status} - ${text}`);
    }
    return response.json();
  }

  async getClientes(): Promise<Cliente[]> {
    const response = await fetch(`${this.baseURL}/`);
    return this.handleResponse(response);
  }

  async getClienteById(id: number): Promise<Cliente> {
    const response = await fetch(`${this.baseURL}/clientes/${id}`);
    const data = await this.handleResponse(response);
    // Garante que retorna um objeto, mesmo se o backend mandar array
    return Array.isArray(data) ? data[0] : data;
  }

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<any> {
    const response = await fetch(`${this.baseURL}/clientes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });
    return this.handleResponse(response);
  }

  async updateCliente(id: number, cliente: Omit<Cliente, 'id'>): Promise<any> {
    const response = await fetch(`${this.baseURL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });
    return this.handleResponse(response);
  }

  async deleteCliente(id: number): Promise<any> {
    console.log(`Deletando cliente ${id} na URL: ${this.baseURL}/clientes/${id}`);
    const response = await fetch(`${this.baseURL}/clientes/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();