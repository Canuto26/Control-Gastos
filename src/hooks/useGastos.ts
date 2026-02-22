// hooks/useGastos.ts
import { useState, useEffect, useCallback } from 'react';
import type { Gasto, GastoFormData, GastoFilters, PaginatedResponse } from '../types';
import * as gastoService from '../services/gastoService';

export const useGastos = (initialFilters?: GastoFilters) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GastoFilters>({
    page: 1,
    limit: 10,
    sortBy: 'fechaHora',
    sortOrder: 'desc',
    ...initialFilters
  });

  const fetchGastos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await gastoService.getGastos(filters);
      setGastos(response.data);
      setTotal(response.total);
    } catch (err) {
      setError('Error al cargar los gastos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createGasto = async (data: GastoFormData) => {
    setIsLoading(true);
    try {
      await gastoService.createGasto(data);
      await fetchGastos(); // Recargar la lista
      return true;
    } catch (err) {
      setError('Error al crear el gasto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGasto = async (id: string, data: GastoFormData) => {
    setIsLoading(true);
    try {
      await gastoService.updateGasto(id, data);
      await fetchGastos();
      return true;
    } catch (err) {
      setError('Error al actualizar el gasto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGasto = async (id: string) => {
    setIsLoading(true);
    try {
      await gastoService.deleteGasto(id);
      await fetchGastos();
      return true;
    } catch (err) {
      setError('Error al eliminar el gasto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  return {
    gastos,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    createGasto,
    updateGasto,
    deleteGasto,
    refresh: fetchGastos
  };
};