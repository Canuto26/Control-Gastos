// components/gastos/GastoTable.tsx
import React from 'react';
import { Gasto } from '../../types';
import { GastoRow } from './GastoRow';

interface GastoTableProps {
  gastos: Gasto[];
  total: number;
  onSort: (field: keyof Gasto, order: 'asc' | 'desc') => void;
  sortField: keyof Gasto;
  sortOrder: 'asc' | 'desc';
  onEdit: (gasto: Gasto) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const GastoTable: React.FC<GastoTableProps> = ({
  gastos,
  total,
  onSort,
  sortField,
  sortOrder,
  onEdit,
  onDelete,
  isLoading
}) => {
  const handleSort = (field: keyof Gasto) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, order);
  };

  const getSortIcon = (field: keyof Gasto) => {
    if (field !== sortField) return 'fa-sort';
    return sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  };

  return (
    <>
      <div className="resumen-gastos">
        <div className="total-acumulado">
          <span className="total-label">Total acumulado</span>
          <span className="total-valor">
            ${total.toFixed(2)}
          </span>
        </div>
        <div className="conteo-gastos">
          <span className="conteo-label">Gastos registrados:</span>
          <span className="conteo-valor">{gastos.length}</span>
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-gastos">
          <thead>
            <tr>
              <th scope="col" className="col-descripcion">
                <button
                  className="btn-orden-columna"
                  onClick={() => handleSort('descripcion')}
                >
                  Descripción
                  <i className={`fas ${getSortIcon('descripcion')}`}></i>
                </button>
              </th>
              <th scope="col" className="col-monto">
                <button
                  className="btn-orden-columna"
                  onClick={() => handleSort('monto')}
                >
                  Monto
                  <i className={`fas ${getSortIcon('monto')}`}></i>
                </button>
              </th>
              <th scope="col" className="col-fecha">
                <button
                  className="btn-orden-columna active"
                  onClick={() => handleSort('fechaHora')}
                >
                  Fecha y hora
                  <i className={`fas ${getSortIcon('fechaHora')}`}></i>
                </button>
              </th>
              <th scope="col" className="col-categoria">
                <button
                  className="btn-orden-columna"
                  onClick={() => handleSort('categoriaId')}
                >
                  Categoría
                  <i className={`fas ${getSortIcon('categoriaId')}`}></i>
                </button>
              </th>
              <th scope="col" className="col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Cargando...
                </td>
              </tr>
            ) : gastos.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="sin-gastos">
                    <i className="fas fa-receipt"></i>
                    <p>No hay gastos registrados aún</p>
                    <p className="sugerencia">
                      ¡Comienza agregando tu primer gasto!
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              gastos.map(gasto => (
                <GastoRow
                  key={gasto.id}
                  gasto={gasto}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};