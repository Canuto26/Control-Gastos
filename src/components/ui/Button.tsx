// components/ui/Button.tsx
import React from 'react';

export type ButtonVariant = 'primario' | 'secundario' | 'peligro' | 'exito' | 'info' | 'texto';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primario',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';

  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="btn-spinner">
          <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
        </span>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      
      {children && <span className="btn-text">{children}</span>}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

// Estilos específicos
const styles = `
.btn {
  border: none;
  border-radius: var(--radio-md);
  font-weight: var(--peso-semibold);
  cursor: pointer;
  transition: var(--transicion-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--espaciado-sm);
  font-family: var(--fuente-principal);
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.btn:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Variantes */
.btn-primario {
  background: linear-gradient(135deg, var(--color-primario), var(--color-primario-oscuro));
  color: white;
  box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.3);
}

.btn-primario:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(67, 97, 238, 0.5);
}

.btn-secundario {
  background: var(--color-fondo-alterno);
  color: var(--color-texto);
  border: 2px solid var(--color-borde);
}

.btn-secundario:hover:not(:disabled) {
  background: var(--color-borde);
  transform: translateY(-2px);
}

.btn-peligro {
  background: var(--color-peligro);
  color: white;
}

.btn-peligro:hover:not(:disabled) {
  background: #d64161;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(239, 71, 111, 0.5);
}

.btn-exito {
  background: var(--color-exito);
  color: white;
}

.btn-exito:hover:not(:disabled) {
  background: #05b589;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(6, 214, 160, 0.5);
}

.btn-info {
  background: var(--color-info);
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #0e6f91;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(17, 138, 178, 0.5);
}

.btn-texto {
  background: transparent;
  color: var(--color-primario);
  padding: var(--espaciado-sm) var(--espaciado-md);
}

.btn-texto:hover:not(:disabled) {
  background: var(--color-primario-claro);
  transform: translateY(-1px);
}

/* Tamaños */
.btn-sm {
  padding: var(--espaciado-sm) var(--espaciado-md);
  font-size: 0.85rem;
}

.btn-md {
  padding: var(--espaciado-md) var(--espaciado-lg);
  font-size: 1rem;
}

.btn-lg {
  padding: var(--espaciado-lg) var(--espaciado-xl);
  font-size: 1.1rem;
}

/* Full width */
.btn-full-width {
  width: 100%;
}

/* Loading state */
.btn-loading {
  cursor: wait;
  opacity: 0.7;
}

.btn-spinner {
  margin-right: var(--espaciado-sm);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Iconos */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-left {
  margin-right: var(--espaciado-xs);
}

.btn-icon-right {
  margin-left: var(--espaciado-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .btn-lg {
    padding: var(--espaciado-md) var(--espaciado-lg);
    font-size: 1rem;
  }
  
  .btn-sm {
    padding: var(--espaciado-xs) var(--espaciado-sm);
    font-size: 0.8rem;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}