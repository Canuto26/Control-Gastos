// components/categorias/CategoriaItem.tsx
import React from 'react';
import { Categoria } from '../../types';

interface CategoriaItemProps {
  categoria: Categoria;
  isSelected?: boolean;
  onSelect?: (categoriaId: string) => void;
  showConteo?: boolean;
}

export const CategoriaItem: React.FC<CategoriaItemProps> = ({
  categoria,
  isSelected = false,
  onSelect,
  showConteo = true
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(categoria.id);
    }
  };

  // Determinar el color de fondo basado en el nombre de la categoría (para variación visual)
  const getCategoryColor = (nombre: string): string => {
    const colors = [
      'rgba(67, 97, 238, 0.1)',   // primario
      'rgba(6, 214, 160, 0.1)',    // éxito
      'rgba(239, 71, 111, 0.1)',   // peligro
      'rgba(255, 209, 102, 0.1)',  // advertencia
      'rgba(114, 9, 183, 0.1)',    // secundario
      'rgba(17, 138, 178, 0.1)'    // info
    ];
    
    // Usar el nombre para generar un índice consistente
    const index = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <li 
      className={`categoria-item ${isSelected ? 'selected' : ''}`}
      role="listitem"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      tabIndex={onSelect ? 0 : -1}
      style={onSelect ? { cursor: 'pointer' } : undefined}
    >
      <div className="categoria-info">
        <div 
          className="categoria-color-indicator"
          style={{ backgroundColor: getCategoryColor(categoria.nombre) }}
        />
        <span className="categoria-nombre">{categoria.nombre}</span>
      </div>
      
      {showConteo && categoria._count && (
        <span className="categoria-conteo">
          {categoria._count.gastos} {categoria._count.gastos === 1 ? 'gasto' : 'gastos'}
        </span>
      )}

      {isSelected && (
        <i className="fas fa-check categoria-selected-icon" aria-hidden="true"></i>
      )}
    </li>
  );
};

// Estilos adicionales específicos del componente
const styles = `
.categoria-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--espaciado-md) var(--espaciado-lg);
  border-bottom: 1px solid var(--color-borde-claro);
  transition: var(--transicion-rapida);
  position: relative;
}

.categoria-item:last-child {
  border-bottom: none;
}

.categoria-item:hover:not(:focus-visible) {
  background: var(--color-primario-claro);
  transform: translateX(5px);
}

.categoria-item.selected {
  background: var(--color-primario-claro);
  border-left: 4px solid var(--color-primario);
}

.categoria-item:focus-visible {
  outline: 2px solid var(--color-primario);
  outline-offset: -2px;
}

.categoria-info {
  display: flex;
  align-items: center;
  gap: var(--espaciado-sm);
  flex: 1;
}

.categoria-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: var(--radio-circular);
  transition: var(--transicion-rapida);
}

.categoria-item:hover .categoria-color-indicator {
  transform: scale(1.2);
}

.categoria-nombre {
  font-weight: var(--peso-medium);
  color: var(--color-texto);
  font-size: 0.95rem;
}

.categoria-conteo {
  font-size: 0.85rem;
  color: var(--color-texto-claro);
  background: var(--color-fondo-alterno);
  padding: var(--espaciado-xs) var(--espaciado-sm);
  border-radius: 20px;
  margin-right: var(--espaciado-sm);
}

.categoria-selected-icon {
  color: var(--color-primario);
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .categoria-item {
    padding: var(--espaciado-sm) var(--espaciado-md);
  }
  
  .categoria-nombre {
    font-size: 0.9rem;
  }
}
`;

// Inyectar estilos (o importar desde archivo CSS)
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}