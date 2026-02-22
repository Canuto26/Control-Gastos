// services/gastoService.ts
import type { Gasto, GastoFormData, GastoFilters, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getGastos = async (
  filters: GastoFilters
): Promise<PaginatedResponse<Gasto>> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('order', filters.sortOrder);
  if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_URL}/gastos?${params}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener gastos');
  }

  return response.json();
};

export const createGasto = async (data: GastoFormData): Promise<Gasto> => {
  const response = await fetch(`${API_URL}/gastos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear gasto');
  }

  return response.json();
};

export const updateGasto = async (id: string, data: GastoFormData): Promise<Gasto> => {
  const response = await fetch(`${API_URL}/gastos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar gasto');
  }

  return response.json();
};

export const deleteGasto = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/gastos/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar gasto');
  }
};