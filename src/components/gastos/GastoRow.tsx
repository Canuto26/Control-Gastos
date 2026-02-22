// components/gastos/GastoRow.tsx
import React, { useState } from 'react';
import { Gasto } from '../../types';

interface GastoRowProps {
  gasto: Gasto;
  onEdit: (gasto: Gasto) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export const GastoRow: React.FC<GastoRowProps> = ({
  gasto,
  onEdit,
  onDelete,
  isSelected = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatMonto = (monto: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(monto);
  };

  const formatFecha = (fechaHora: string): string => {
    const fecha = new Date(fechaHora);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(fecha);
  };

  const getCategoryColorClass = (categoriaNombre: string): string => {
    const colorMap: Record<string, string> = {
      'Alimentación': 'categoria-alimentacion',
      'Transporte': 'categoria-transporte',
      'Entretenimiento': 'categoria-entretenimiento',
      'Servicios': 'categoria-servicios',
      'Salud': 'categoria-salud',
      'Educación': 'categoria-educacion',
      'Ropa': 'categoria-ropa',
      'Hogar': 'categoria-hogar'
    };

    return colorMap[categoriaNombre] || 'categoria-default';
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <tr 
      className={`gasto-item ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="col-descripcion">
        <div className="gasto-descripcion-container">
          <span className="gasto-descripcion">{gasto.descripcion}</span>
          {isHovered && (
            <span className="gasto-id-hint">
              ID: {gasto.id.slice(0, 8)}...
            </span>
          )}
        </div>
      </td>

      <td className="col-monto">
        <span className="gasto-monto positivo">
          {formatMonto(gasto.monto)}
        </span>
      </td>

      <td className="col-fecha">
        <time dateTime={gasto.fechaHora} className="gasto-fecha">
          <i className="fas fa-calendar-alt" aria-hidden="true"></i>
          {formatFecha(gasto.fechaHora)}
        </time>
      </td>

      <td className="col-categoria">
        {gasto.categoria ? (
          <span className={`categoria-badge ${getCategoryColorClass(gasto.categoria.nombre)}`}>
            <i className="fas fa-tag" aria-hidden="true"></i>
            {gasto.categoria.nombre}
          </span>
        ) : (
          <span className="categoria-badge categoria-desconocida">
            <i className="fas fa-question-circle" aria-hidden="true"></i>
            Sin categoría
          </span>
        )}
      </td>

      <td className="col-acciones">
        <div className="acciones-container">
          <button
            className="btn-accion btn-editar"
            onClick={() => onEdit(gasto)}
            onKeyDown={(e) => handleKeyDown(e, () => onEdit(gasto))}
            aria-label={`Editar gasto: ${gasto.descripcion}`}
            title="Editar gasto"
          >
            <i className="fas fa-edit" aria-hidden="true"></i>
          </button>

          <button
            className="btn-accion btn-eliminar"
            onClick={() => onDelete(gasto.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onDelete(gasto.id))}
            aria-label={`Eliminar gasto: ${gasto.descripcion}`}
            title="Eliminar gasto"
          >
            <i className="fas fa-trash-alt" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Estilos específicos
const styles = `
.gasto-item {
  transition: var(--transicion-normal);
  animation: slideInRight 0.3s ease;
  animation-fill-mode: both;
}

.gasto-item.selected {
  background: var(--color-primario-claro);
  border-left: 4px solid var(--color-primario);
}

.gasto-item:hover {
  background: var(--color-fondo-alterno);
}

.gasto-descripcion-container {
  position: relative;
  display: inline-block;
}

.gasto-descripcion {
  font-weight: var(--peso-medium);
  color: var(--color-texto);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 250px;
}

.gasto-id-hint {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--color-texto);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radio-sm);
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: var(--z-index-tooltip);
  pointer-events: none;
  opacity: 0.9;
}

.gasto-id-hint::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--color-texto) transparent transparent transparent;
}

.gasto-monto {
  font-weight: var(--peso-semibold);
  font-size: 1rem;
}

.gasto-monto.positivo {
  color: var(--color-exito);
}

.gasto-monto.negativo {
  color: var(--color-peligro);
}

.gasto-fecha {
  display: flex;
  align-items: center;
  gap: var(--espaciado-sm);
  color: var(--color-texto-claro);
  font-size: 0.9rem;
}

.gasto-fecha i {
  font-size: 0.85rem;
  opacity: 0.7;
}

.categoria-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--espaciado-xs);
  padding: var(--espaciado-xs) var(--espaciado-md);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: var(--peso-medium);
  white-space: nowrap;
}

.categoria-badge i {
  font-size: 0.75rem;
}

.categoria-alimentacion {
  background: #e8f5e9;
  color: #2e7d32;
}

.categoria-transporte {
  background: #e3f2fd;
  color: #1565c0;
}

.categoria-entretenimiento {
  background: #f3e5f5;
  color: #7b1fa2;
}

.categoria-servicios {
  background: #fff3e0;
  color: #e65100;
}

.categoria-salud {
  background: #fce4ec;
  color: #c2185b;
}

.categoria-educacion {
  background: #e0f2f1;
  color: #00695c;
}

.categoria-ropa {
  background: #f1f8e9;
  color: #33691e;
}

.categoria-hogar {
  background: #efebe9;
  color: #4e342e;
}

.categoria-default {
  background: var(--color-fondo-alterno);
  color: var(--color-texto-claro);
}

.categoria-desconocida {
  background: #ffebee;
  color: var(--color-peligro);
}

.acciones-container {
  display: flex;
  gap: var(--espaciado-xs);
  opacity: 0.7;
  transition: var(--transicion-rapida);
}

.gasto-item:hover .acciones-container {
  opacity: 1;
}

.btn-accion {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radio-sm);
  cursor: pointer;
  transition: var(--transicion-rapida);
  background: transparent;
  color: var(--color-texto-claro);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-accion:hover {
  transform: scale(1.1);
}

.btn-editar:hover {
  color: var(--color-info);
  background: #e1f5fe;
}

.btn-eliminar:hover {
  color: var(--color-peligro);
  background: #ffebee;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .gasto-fecha {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  .gasto-fecha i {
    display: none;
  }
  
  .acciones-container {
    opacity: 1;
  }
  
  .gasto-id-hint {
    display: none;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}