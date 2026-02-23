// components/ui/Card.tsx
import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  noOverflow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  header,
  footer,
  onClick,
  hoverable = false,
  bordered = true,
  noOverflow = false,
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = `card-${variant}`;
  const paddingClass = `card-padding-${padding}`;
  const hoverClass = hoverable ? 'card-hoverable' : '';
  const borderClass = bordered ? 'card-bordered' : 'card-borderless';
  const overflowClass = noOverflow ? 'card-no-overflow' : '';
  const clickableClass = onClick ? 'card-clickable' : '';

  const cardClasses = [
    baseClass,
    variantClass,
    paddingClass,
    hoverClass,
    borderClass,
    overflowClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      } : undefined}
      {...props}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

// Estilos específicos
const styles = `
.card {
  background: var(--color-fondo-tarjeta);
  border-radius: var(--radio-xl);
  transition: var(--transicion-normal);
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Variantes */
.card-default {
  background: var(--color-fondo-tarjeta);
  box-shadow: var(--sombra);
}

.card-elevated {
  background: var(--color-fondo-tarjeta);
  box-shadow: var(--sombra-fuerte);
}

.card-outlined {
  background: transparent;
  border: 2px solid var(--color-borde);
  box-shadow: none;
}

.card-flat {
  background: var(--color-fondo-tarjeta);
  box-shadow: none;
}

/* Bordes */
.card-bordered {
  border: 1px solid var(--color-borde-claro);
}

.card-borderless {
  border: none;
}

/* Padding */
.card-padding-none .card-body {
  padding: 0;
}

.card-padding-sm .card-body {
  padding: var(--espaciado-sm);
}

.card-padding-md .card-body {
  padding: var(--espaciado-lg);
}

.card-padding-lg .card-body {
  padding: var(--espaciado-xl);
}

/* Hover */
.card-hoverable:hover {
  transform: translateY(-5px);
  box-shadow: var(--sombra-hover);
}

/* Clickable */
.card-clickable {
  cursor: pointer;
}

.card-clickable:focus-visible {
  outline: 3px solid var(--color-primario);
  outline-offset: 2px;
}

/* Header y Footer */
.card-header {
  padding: var(--espaciado-lg);
  border-bottom: 2px solid var(--color-borde-claro);
  background: linear-gradient(to right, rgba(67, 97, 238, 0.02), transparent);
  border-radius: var(--radio-xl) var(--radio-xl) 0 0;
}

.card-footer {
  padding: var(--espaciado-lg);
  border-top: 2px solid var(--color-borde-claro);
  background: var(--color-fondo-alterno);
  border-radius: 0 0 var(--radio-xl) var(--radio-xl);
}

/* Overflow */
.card-no-overflow {
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .card-padding-lg .card-body {
    padding: var(--espaciado-lg);
  }
  
  .card-header,
  .card-footer {
    padding: var(--espaciado-md);
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}