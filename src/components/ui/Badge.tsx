// components/ui/Badge.tsx
import React from 'react';

export type BadgeVariant = 
  | 'primario' 
  | 'secundario' 
  | 'exito' 
  | 'peligro' 
  | 'advertencia' 
  | 'info' 
  | 'gris'
  | 'alimentacion'
  | 'transporte'
  | 'entretenimiento'
  | 'servicios';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  pill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primario',
  size = 'md',
  icon,
  removable = false,
  onRemove,
  className = '',
  pill = true
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;
  const pillClass = pill ? 'badge-pill' : 'badge-square';

  const badgeClasses = [
    baseClass,
    variantClass,
    sizeClass,
    pillClass,
    className
  ].filter(Boolean).join(' ');

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span className={badgeClasses}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-text">{children}</span>
      {removable && (
        <button
          className="badge-remove"
          onClick={handleRemove}
          aria-label="Eliminar"
          type="button"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      )}
    </span>
  );
};

// Estilos específicos
const styles = `
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--espaciado-xs);
  font-weight: var(--peso-medium);
  white-space: nowrap;
  transition: var(--transicion-rapida);
  max-width: 100%;
}

.badge-pill {
  border-radius: 20px;
}

.badge-square {
  border-radius: var(--radio-sm);
}

/* Tamaños */
.badge-sm {
  padding: 2px var(--espaciado-sm);
  font-size: 0.75rem;
  height: 20px;
}

.badge-md {
  padding: var(--espaciado-xs) var(--espaciado-md);
  font-size: 0.85rem;
  height: 28px;
}

.badge-lg {
  padding: var(--espaciado-sm) var(--espaciado-lg);
  font-size: 1rem;
  height: 36px;
}

/* Variantes base */
.badge-primario {
  background: var(--color-primario-claro);
  color: var(--color-primario-oscuro);
}

.badge-secundario {
  background: rgba(114, 9, 183, 0.1);
  color: var(--color-secundario);
}

.badge-exito {
  background: rgba(6, 214, 160, 0.1);
  color: var(--color-exito);
}

.badge-peligro {
  background: rgba(239, 71, 111, 0.1);
  color: var(--color-peligro);
}

.badge-advertencia {
  background: rgba(255, 209, 102, 0.1);
  color: #b85e00;
}

.badge-info {
  background: rgba(17, 138, 178, 0.1);
  color: var(--color-info);
}

.badge-gris {
  background: var(--color-fondo-alterno);
  color: var(--color-texto-claro);
}

/* Variantes específicas para categorías */
.badge-alimentacion {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-transporte {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-entretenimiento {
  background: #f3e5f5;
  color: #7b1fa2;
}

.badge-servicios {
  background: #fff3e0;
  color: #e65100;
}

/* Icono */
.badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
}

/* Removable */
.badge-remove {
  background: none;
  border: none;
  padding: 0;
  margin-left: var(--espaciado-xs);
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: var(--transicion-rapida);
  width: 16px;
  height: 16px;
  border-radius: var(--radio-circular);
}

.badge-remove:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.badge-remove:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Texto truncado */
.badge-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .badge-lg {
    padding: var(--espaciado-xs) var(--espaciado-md);
    font-size: 0.9rem;
    height: 32px;
  }
  
  .badge-text {
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .badge-text {
    max-width: 120px;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}