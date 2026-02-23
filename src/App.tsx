// App.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { EstadisticasGrid } from './components/estadisticas/EstadisticasGrid';
import { CategoriaForm } from './components/categorias/CategoriaForm';
import { CategoriaList } from './components/categorias/CategoriaList';
import { GastoForm } from './components/gastos/GastoForm';
import { GastoTable } from './components/gastos/GastoTable';
import { ConfirmModal } from './components/shared/ConfirmModal';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';

// Types
import type { Gasto, GastoFormData, Categoria } from './types';

// Servicios y hooks
import { useCategorias } from './services/categoriaService';
import { useGastos } from './hooks/useGastos';

// Estilos globales
import './App.css';

function App() {
  // ==================== ESTADOS ====================
  const [gastoToEdit, setGastoToEdit] = useState<Gasto | null>(null);
  const [gastoToDelete, setGastoToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | undefined>();
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // ==================== HOOKS PERSONALIZADOS ====================
  const {
    categorias,
    isLoading: categoriasLoading,
    error: categoriasError,
    totalCategorias,
    createCategoria,
    refresh: refreshCategorias
  } = useCategorias(true); // true para incluir conteo de gastos

  const {
    gastos,
    total: totalGastos,
    isLoading: gastosLoading,
    error: gastosError,
    filters,
    setFilters,
    createGasto,
    updateGasto,
    deleteGasto,
    refresh: refreshGastos
  } = useGastos({
    page: 1,
    limit: 10,
    sortBy: 'fechaHora',
    sortOrder: 'desc',
    categoriaId: selectedCategoriaId
  });

  // ==================== ESTADÍSTICAS DERIVADAS ====================
  const [estadisticas, setEstadisticas] = useState({
    totalGastos: 0,
    gastosMes: 0,
    promedioDia: 0,
    gastosPorCategoria: {} as Record<string, number>
  });

  // Calcular estadísticas cuando cambian los gastos
  useEffect(() => {
    if (gastos.length > 0) {
      const total = gastos.reduce((sum, g) => sum + g.monto, 0);
      
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

      // Gastos por categoría
      const porCategoria: Record<string, number> = {};
      gastos.forEach(g => {
        const catId = g.categoriaId;
        porCategoria[catId] = (porCategoria[catId] || 0) + g.monto;
      });

      setEstadisticas({
        totalGastos: total,
        gastosMes,
        promedioDia,
        gastosPorCategoria: porCategoria
      });
    } else {
      setEstadisticas({
        totalGastos: 0,
        gastosMes: 0,
        promedioDia: 0,
        gastosPorCategoria: {}
      });
    }
  }, [gastos]);

  // ==================== MANEJADORES DE EVENTOS ====================

  const handleCreateGasto = async (data: GastoFormData) => {
    try {
      await createGasto(data);
      // Refrescar categorías para actualizar conteos
      refreshCategorias();
    } catch (error) {
      console.error('Error al crear gasto:', error);
    }
  };

  const handleUpdateGasto = async (data: GastoFormData) => {
    if (gastoToEdit) {
      try {
        await updateGasto(gastoToEdit.id, data);
        setGastoToEdit(null);
        refreshCategorias();
      } catch (error) {
        console.error('Error al actualizar gasto:', error);
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setGastoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (gastoToDelete) {
      try {
        await deleteGasto(gastoToDelete);
        setShowDeleteModal(false);
        setGastoToDelete(null);
        refreshCategorias();
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
      }
    }
  };

  const handleEditGasto = (gasto: Gasto) => {
    setGastoToEdit(gasto);
    // Scroll suave al formulario
    document.getElementById('formulario-gasto')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoriaSelect = (categoriaId: string) => {
    setSelectedCategoriaId(categoriaId === selectedCategoriaId ? undefined : categoriaId);
    setFilters({
      ...filters,
      categoriaId: categoriaId === selectedCategoriaId ? undefined : categoriaId,
      page: 1 // Resetear a primera página
    });
  };

  const handleSort = (field: keyof Gasto, order: 'asc' | 'desc') => {
    setFilters({
      ...filters,
      sortBy: field,
      sortOrder: order
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage
    });
    // Scroll a la tabla
    document.getElementById('tabla-gastos')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==================== RENDERIZADO ====================

  // Si hay un error crítico
  if (categoriasError || gastosError) {
    return (
      <Layout totalGeneral={estadisticas.totalGastos}>
        <div className="error-container">
          <i className="fas fa-exclamation-triangle error-icon"></i>
          <h2>Oops! Algo salió mal</h2>
          <p>{categoriasError || gastosError}</p>
          <Button 
            variant="primario" 
            onClick={() => {
              refreshCategorias();
              refreshGastos();
            }}
          >
            <i className="fas fa-sync-alt"></i>
            Reintentar
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout totalGeneral={estadisticas.totalGastos}>
      {/* Barra de herramientas superior */}
      <div className="toolbar">
        <div className="toolbar-left">
          <Badge variant="info" size="lg" icon={<i className="fas fa-chart-line"></i>}>
            {gastos.length} gastos · ${estadisticas.totalGastos.toFixed(2)} total
          </Badge>
          
          {selectedCategoriaId && (
            <Badge 
              variant="primario" 
              removable 
              onRemove={() => handleCategoriaSelect(selectedCategoriaId)}
            >
              Filtro: {categorias.find(c => c.id === selectedCategoriaId)?.nombre}
            </Badge>
          )}
        </div>

        <div className="toolbar-right">
          <Button
            variant="texto"
            size="sm"
            onClick={() => refreshGastos()}
            icon={<i className="fas fa-sync-alt"></i>}
          >
            Actualizar
          </Button>

          <Button
            variant="secundario"
            size="sm"
            onClick={() => setShowCategoriaModal(true)}
            icon={<i className="fas fa-cog"></i>}
          >
            Gestionar Categorías
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <EstadisticasGrid
        totalGastos={gastos.length}
        totalCategorias={totalCategorias}
        gastosMes={estadisticas.gastosMes}
        promedioDia={estadisticas.promedioDia}
      />

      {/* Grid principal */}
      <div className="dashboard-grid">
        {/* Columna izquierda - Formularios */}
        <div className="columna-formularios">
          {/* Sección de Categorías */}
          <section className="card seccion-categorias" id="seccion-categorias">
            <header className="card-header">
              <h2 className="card-titulo">
                <i className="fas fa-tags"></i>
                Categorías
              </h2>
              <Badge variant="gris">{totalCategorias} total</Badge>
            </header>

            <div className="card-body">
              {categoriasLoading && !categorias.length ? (
                <div className="categorias-loading">
                  <LoadingSpinner size="sm" text="Cargando categorías..." />
                </div>
              ) : (
                <>
                  <CategoriaForm
                    onCreateCategoria={async (data) => {
                      await createCategoria(data);
                      refreshGastos(); // Actualizar gastos para reflejar nuevas categorías
                    }}
                    isLoading={categoriasLoading}
                  />

                  {categorias.length > 0 ? (
                    <CategoriaList
                      categorias={categorias}
                      selectedCategoriaId={selectedCategoriaId}
                      onSelectCategoria={handleCategoriaSelect}
                    />
                  ) : (
                    <div className="empty-categorias">
                      <i className="fas fa-folder-open"></i>
                      <p>No hay categorías creadas aún</p>
                      <p className="sugerencia">
                        Crea tu primera categoría para comenzar
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Sección de Registro de Gastos */}
          <section className="card seccion-registro" id="formulario-gasto">
            <header className="card-header">
              <h2 className="card-titulo">
                <i className={`fas fa-${gastoToEdit ? 'edit' : 'plus-circle'}`}></i>
                {gastoToEdit ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
              </h2>
              {gastoToEdit && (
                <Button
                  variant="texto"
                  size="sm"
                  onClick={() => setGastoToEdit(null)}
                  icon={<i className="fas fa-times"></i>}
                >
                  Cancelar edición
                </Button>
              )}
            </header>

            <div className="card-body">
              {categorias.length === 0 ? (
                <div className="no-categorias-warning">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>Necesitas crear al menos una categoría para registrar gastos</p>
                  <Button
                    variant="primario"
                    size="sm"
                    onClick={() => document.getElementById('seccion-categorias')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <i className="fas fa-arrow-up"></i>
                    Ir a Categorías
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          </section>
        </div>

        {/* Columna derecha - Listado de Gastos */}
        <div className="columna-listado">
          <section className="card seccion-gastos" id="tabla-gastos">
            <header className="card-header">
              <h2 className="card-titulo">
                <i className="fas fa-history"></i>
                Historial de Gastos
              </h2>

              <div className="controles-tabla">
                {/* Ordenamiento */}
                <div className="ordenamiento-buttons">
                  <Button
                    variant={filters.sortBy === 'fechaHora' ? 'primario' : 'texto'}
                    size="sm"
                    onClick={() => handleSort('fechaHora', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                    icon={<i className={`fas fa-sort-amount-${filters.sortOrder === 'desc' ? 'down' : 'up'}`}></i>}
                  >
                    Fecha
                  </Button>
                  <Button
                    variant={filters.sortBy === 'monto' ? 'primario' : 'texto'}
                    size="sm"
                    onClick={() => handleSort('monto', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                    icon={<i className="fas fa-dollar-sign"></i>}
                  >
                    Monto
                  </Button>
                  <Button
                    variant={filters.sortBy === 'descripcion' ? 'primario' : 'texto'}
                    size="sm"
                    onClick={() => handleSort('descripcion', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                    icon={<i className="fas fa-sort-alpha-${filters.sortOrder === 'desc' ? 'down' : 'up'}"></i>}
                  >
                    Descripción
                  </Button>
                </div>

                {/* Paginación */}
                <div className="paginacion-info">
                  <Badge variant="gris">
                    Página {filters.page} · {filters.limit} por página
                  </Badge>
                </div>
              </div>
            </header>

            <div className="card-body">
              {gastosLoading && !gastos.length ? (
                <div className="gastos-loading">
                  <LoadingSpinner size="lg" text="Cargando gastos..." />
                </div>
              ) : (
                <GastoTable
                  gastos={gastos}
                  total={estadisticas.totalGastos}
                  onSort={handleSort}
                  sortField={filters.sortBy as any}
                  sortOrder={filters.sortOrder as any}
                  onEdit={handleEditGasto}
                  onDelete={handleDeleteClick}
                  isLoading={gastosLoading}
                />
              )}

              {/* Controles de paginación */}
              {!gastosLoading && gastos.length > 0 && (
                <div className="paginacion-controls">
                  <Button
                    variant="secundario"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    icon={<i className="fas fa-chevron-left"></i>}
                  >
                    Anterior
                  </Button>
                  <span className="paginacion-pages">
                    {filters.page} / {Math.ceil(gastos.length / (filters.limit || 10))}
                  </span>
                  <Button
                    variant="secundario"
                    size="sm"
                    disabled={gastos.length < (filters.limit || 10)}
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    icon={<i className="fas fa-chevron-right"></i>}
                    iconPosition="right"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Eliminar Gasto"
        message="¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="peligro"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setGastoToDelete(null);
        }}
        isLoading={gastosLoading}
      />

      {/* Modal de gestión de categorías (simplificado) */}
      <ConfirmModal
        isOpen={showCategoriaModal}
        title="Gestión de Categorías"
        message="¿Deseas ir a la sección de categorías?"
        confirmText="Ir a Categorías"
        cancelText="Cancelar"
        variant="info"
        onConfirm={() => {
          setShowCategoriaModal(false);
          document.getElementById('seccion-categorias')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onCancel={() => setShowCategoriaModal(false)}
      />
    </Layout>
  );
}

export default App;