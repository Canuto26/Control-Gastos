// services/categoriaService.ts
import { Categoria, CategoriaFormData, ApiResponse, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuración base para fetch
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Manejo de errores unificado
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// ==================== CATEGORÍAS ====================

/**
 * Obtiene todas las categorías
 * @param includeCount - Incluir conteo de gastos asociados
 */
export const getCategorias = async (includeCount = true): Promise<Categoria[]> => {
  try {
    const response = await fetch(
      `${API_URL}/categorias${includeCount ? '?includeCount=true' : ''}`,
      {
        ...fetchConfig,
        method: 'GET',
      }
    );
    
    const data = await handleResponse<ApiResponse<Categoria[]>>(response);
    return data.data;
  } catch (error) {
    console.error('Error en getCategorias:', error);
    throw error;
  }
};

/**
 * Obtiene una categoría por su ID
 * @param id - UUID de la categoría
 */
export const getCategoriaById = async (id: string): Promise<Categoria> => {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      ...fetchConfig,
      method: 'GET',
    });
    
    const data = await handleResponse<ApiResponse<Categoria>>(response);
    return data.data;
  } catch (error) {
    console.error(`Error en getCategoriaById para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva categoría
 * @param data - Datos de la categoría (nombre)
 */
export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  try {
    // Validación local antes de enviar
    if (!data.nombre || data.nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    const response = await fetch(`${API_URL}/categorias`, {
      ...fetchConfig,
      method: 'POST',
      body: JSON.stringify({
        nombre: data.nombre.trim(),
      }),
    });
    
    const responseData = await handleResponse<ApiResponse<Categoria>>(response);
    return responseData.data;
  } catch (error) {
    console.error('Error en createCategoria:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente
 * @param id - UUID de la categoría
 * @param data - Nuevos datos
 */
export const updateCategoria = async (
  id: string, 
  data: Partial<CategoriaFormData>
): Promise<Categoria> => {
  try {
    if (data.nombre && data.nombre.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    const response = await fetch(`${API_URL}/categorias/${id}`, {
      ...fetchConfig,
      method: 'PUT',
      body: JSON.stringify({
        nombre: data.nombre?.trim(),
      }),
    });
    
    const responseData = await handleResponse<ApiResponse<Categoria>>(response);
    return responseData.data;
  } catch (error) {
    console.error(`Error en updateCategoria para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una categoría
 * @param id - UUID de la categoría
 */
export const deleteCategoria = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      ...fetchConfig,
      method: 'DELETE',
    });
    
    await handleResponse<ApiResponse<null>>(response);
  } catch (error) {
    console.error(`Error en deleteCategoria para ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene categorías con paginación
 * @param page - Número de página
 * @param limit - Elementos por página
 */
export const getCategoriasPaginated = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Categoria>> => {
  try {
    const response = await fetch(
      `${API_URL}/categorias/paginated?page=${page}&limit=${limit}&includeCount=true`,
      {
        ...fetchConfig,
        method: 'GET',
      }
    );
    
    return await handleResponse<PaginatedResponse<Categoria>>(response);
  } catch (error) {
    console.error('Error en getCategoriasPaginated:', error);
    throw error;
  }
};

// ==================== BÚSQUEDA Y FILTROS ====================

/**
 * Busca categorías por nombre
 * @param query - Texto a buscar
 */
export const searchCategorias = async (query: string): Promise<Categoria[]> => {
  try {
    const response = await fetch(
      `${API_URL}/categorias/search?q=${encodeURIComponent(query)}`,
      {
        ...fetchConfig,
        method: 'GET',
      }
    );
    
    const data = await handleResponse<ApiResponse<Categoria[]>>(response);
    return data.data;
  } catch (error) {
    console.error('Error en searchCategorias:', error);
    throw error;
  }
};

// ==================== ESTADÍSTICAS ====================

/**
 * Obtiene estadísticas de categorías
 */
export const getCategoriasEstadisticas = async (): Promise<{
  total: number;
  conGastos: number;
  sinGastos: number;
  masUsada: { nombre: string; cantidad: number } | null;
}> => {
  try {
    const response = await fetch(`${API_URL}/categorias/estadisticas`, {
      ...fetchConfig,
      method: 'GET',
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en getCategoriasEstadisticas:', error);
    throw error;
  }
};

// ==================== HOOK PERSONALIZADO (opcional pero recomendado) ====================

/**
 * Hook personalizado para manejar categorías en componentes funcionales
 */
import { useState, useEffect, useCallback } from 'react';

export const useCategorias = (initialIncludeCount = true) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCategorias, setTotalCategorias] = useState(0);

  const fetchCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategorias(initialIncludeCount);
      setCategorias(data);
      setTotalCategorias(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [initialIncludeCount]);

  const createCategoria = async (data: CategoriaFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const nuevaCategoria = await createCategoria(data);
      setCategorias(prev => [...prev, nuevaCategoria]);
      setTotalCategorias(prev => prev + 1);
      return nuevaCategoria;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategoria = async (id: string, data: Partial<CategoriaFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const categoriaActualizada = await updateCategoria(id, data);
      setCategorias(prev =>
        prev.map(cat => (cat.id === id ? categoriaActualizada : cat))
      );
      return categoriaActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategoria = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCategoria(id);
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      setTotalCategorias(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return {
    categorias,
    isLoading,
    error,
    totalCategorias,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
};