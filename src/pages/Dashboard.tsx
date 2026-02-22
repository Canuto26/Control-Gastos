// pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { EstadisticasGrid } from '../components/estadisticas/EstadisticasGrid';
import { CategoriaForm } from '../components/categorias/CategoriaForm';
import { CategoriaList } from '../components/categorias/CategoriaList';
import { GastoForm } from '../components/gastos/GastoForm';
import { GastoTable } from '../components/gastos/GastoTable';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { useGastos } from '../hooks/useGastos';
import { useCategorias } from '../hooks/useCategorias';
import { Gasto, GastoFormData } from '../types';

export const Dashboard: React.FC = () => {
  // Hooks personalizados
  const {
    gastos,
    total,
    isLoading: gastosLoading,
    filters,
    setFilters,
    createGasto,
    updateGasto,
    deleteGasto
  } = useGastos();

  const {
    categorias,
    totalCategorias,
    isLoading: categoriasLoading,
    createCategoria,
    refresh: refreshCategorias
  } = useCategorias();

  // Estado local
  const [gastoToEdit, setGastoToEdit] = useState<Gasto | null>(null);
  const [gastoToDelete, setGastoToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalGastos: 0,
    gastosMes: 0,
    promedioDia: 0
  });

  // Calcular estadísticas cuando cambian los gastos
  useEffect(() => {
    if (gastos.length > 0) {
      const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
      
      // Gastos del mes actual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const gastosMes = gastos
        .filter(g => {
          const fecha = new Date(g.fechaHora);
          return fecha.getMonth() === currentMonth && 
                 fecha.getFullYear() === currentYear;
        })
        .reduce((sum, g) => sum + g.monto, 0);
      
      // Promedio por día (últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const gastos30Dias = gastos
        .filter(g => new Date(g.fechaHora) >= thirtyDaysAgo)
        .reduce((sum, g) => sum + g.monto, 0);
      
      const promedioDia = gastos30Dias / 30;

      setEstadisticas({
        totalGastos,
        gastosMes,
        promedioDia
      });
    }
  }, [gastos]);

  const handleCreateGasto = async (data: GastoFormData) => {
    await createGasto(data);
  };

  const handleUpdateGasto = async (data: GastoFormData) => {
    if (gastoToEdit) {
      await updateGasto(gastoToEdit.id, data);
      setGastoToEdit(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setGastoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (gastoToDelete) {
      await deleteGasto(gastoToDelete);
      setShowDeleteModal(false);
      setGastoToDelete(null);
    }
  };

  return (
    <>
      <Header totalGeneral={estadisticas.totalGastos} />

      <main className="app-main">
        <div className="contenedor">
          <EstadisticasGrid
            totalGastos={gastos.length}
            totalCategorias={totalCategorias}
            gastosMes={estadisticas.gastosMes}
            promedioDia={estadisticas.promedioDia}
          />

          <div className="dashboard-grid">
            {/* Columna izquierda */}
            <div className="columna-formularios">
              <section className="card seccion-categorias">
                <header className="card-header">
                  <h2 className="card-titulo">
                    <i className="fas fa-tags"></i>
                    Gestión de Categorías
                  </h2>
                  <span className="card-badge">
                    {totalCategorias} categorías
                  </span>
                </header>

                <div className="card-body">
                  <CategoriaForm
                    onCreateCategoria={createCategoria}
                    isLoading={categoriasLoading}
                  />
                  <CategoriaList categorias={categorias} />
                </div>
              </section>

              <section className="card seccion-registro">
                <header className="card-header">
                  <h2 className="card-titulo">
                    <i className="fas fa-plus-circle"></i>
                    {gastoToEdit ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
                  </h2>
                </header>

                <div className="card-body">
                  <GastoForm
                    key={gastoToEdit?.id || 'new'}
                    onSubmit={gastoToEdit ? handleUpdateGasto : handleCreateGasto}
                    categorias={categorias}
                    initialData={gastoToEdit ? {
                      descripcion: gastoToEdit.descripcion,
                      monto: gastoToEdit.monto,
                      fechaHora: gastoToEdit.fechaHora.slice(0, 16),
                      categoriaId: gastoToEdit.categoriaId
                    } : undefined}
                    isEditing={!!gastoToEdit}
                    isLoading={gastosLoading}
                  />
                </div>
              </section>
            </div>

            {/* Columna derecha */}
            <div className="columna-listado">
              <section className="card seccion-gastos">
                <header className="card-header">
                  <h2 className="card-titulo">
                    <i className="fas fa-list"></i>
                    Historial de Gastos
                  </h2>

                  <div className="controles-ordenamiento">
                    <span className="orden-label">Ordenar por:</span>
                    <div className="orden-botones">
                      <button
                        className={`btn-orden ${
                          filters.sortBy === 'fechaHora' && filters.sortOrder === 'desc'
                            ? 'active'
                            : ''
                        }`}
                        onClick={() => setFilters({
                          ...filters,
                          sortBy: 'fechaHora',
                          sortOrder: 'desc'
                        })}
                      >
                        <i className="fas fa-sort-amount-down"></i>
                        Más reciente
                      </button>
                      <button
                        className={`btn-orden ${
                          filters.sortBy === 'fechaHora' && filters.sortOrder === 'asc'
                            ? 'active'
                            : ''
                        }`}
                        onClick={() => setFilters({
                          ...filters,
                          sortBy: 'fechaHora',
                          sortOrder: 'asc'
                        })}
                      >
                        <i className="fas fa-sort-amount-up-alt"></i>
                        Más antiguo
                      </button>
                    </div>
                  </div>
                </header>

                <div className="card-body">
                  <GastoTable
                    gastos={gastos}
                    total={estadisticas.totalGastos}
                    onSort={(field, order) => setFilters({ ...filters, sortBy: field, sortOrder: order })}
                    sortField={filters.sortBy as any}
                    sortOrder={filters.sortOrder as any}
                    onEdit={setGastoToEdit}
                    onDelete={handleDeleteClick}
                    isLoading={gastosLoading}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este gasto?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Eliminar"
        confirmButtonClass="btn-peligro"
      />
    </>
  );
};