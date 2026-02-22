// components/ui/Input.tsx
import React, { forwardRef, useState } from 'react';

export type InputVariant = 'default' | 'error' | 'success' | 'warning';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  variant = 'default',
  inputSize = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onIconClick,
  className = '',
  containerClassName = '',
  id,
  disabled,
  required,
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClass = 'input';
  const variantClass = error ? 'input-error' : `input-${variant}`;
  const sizeClass = `input-${inputSize}`;
  const widthClass = fullWidth ? 'input-full-width' : '';
  const iconClass = icon ? `input-has-icon input-icon-${iconPosition}` : '';

  const inputClasses = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    iconClass,
    className
  ].filter(Boolean).join(' ');

  const handleIconClick = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onIconClick) {
      onIconClick();
    }
  };

  const renderIcon = () => {
    if (isPassword) {
      return (
        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} />
      );
    }
    return icon;
  };

  return (
    <div className={`input-container ${fullWidth ? 'input-container-full-width' : ''} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />

        {icon && (
          <button
            type="button"
            className={`input-icon input-icon-${iconPosition} ${isPassword ? 'input-icon-clickable' : ''}`}
            onClick={handleIconClick}
            tabIndex={isPassword ? 0 : -1}
            aria-label={isPassword ? (showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña') : undefined}
          >
            {renderIcon()}
          </button>
        )}
      </div>

      {error && (
        <div id={`${inputId}-error`} className="input-feedback input-feedback-error" role="alert">
          <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
          {error}
        </div>
      )}

      {hint && !error && (
        <div id={`${inputId}-hint`} className="input-feedback input-feedback-hint">
          <i className="fas fa-info-circle" aria-hidden="true"></i>
          {hint}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Estilos específicos
const styles = `
.input-container {
  display: flex;
  flex-direction: column;
  gap: var(--espaciado-xs);
  margin-bottom: var(--espaciado-md);
}

.input-container-full-width {
  width: 100%;
}

.input-label {
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
  font-weight: var(--peso-medium);
  color: var(--color-texto);
  font-size: 0.95rem;
}

.input-required {
  color: var(--color-peligro);
  font-weight: var(--peso-bold);
  margin-left: var(--espaciado-xs);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: var(--espaciado-md);
  border: 2px solid var(--color-borde);
  border-radius: var(--radio-md);
  font-size: 1rem;
  transition: var(--transicion-rapida);
  font-family: var(--fuente-principal);
  background: white;
  color: var(--color-texto);
}

.input:focus {
  outline: none;
  border-color: var(--color-primario);
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.input:hover:not(:disabled) {
  border-color: var(--color-primario-oscuro);
}

/* Variantes */
.input-error {
  border-color: var(--color-peligro);
}

.input-error:focus {
  border-color: var(--color-peligro);
  box-shadow: 0 0 0 4px rgba(239, 71, 111, 0.1);
}

.input-success {
  border-color: var(--color-exito);
}

.input-warning {
  border-color: var(--color-advertencia);
}

/* Tamaños */
.input-sm {
  padding: var(--espaciado-sm) var(--espaciado-md);
  font-size: 0.85rem;
}

.input-lg {
  padding: var(--espaciado-lg);
  font-size: 1.1rem;
}

/* Full width */
.input-full-width {
  width: 100%;
}

/* Iconos */
.input-has-icon {
  padding-left: var(--espaciado-xl);
}

.input-icon-left {
  left: var(--espaciado-md);
}

.input-icon-right {
  right: var(--espaciado-md);
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-texto-claro);
  pointer-events: none;
}

.input-icon-clickable {
  cursor: pointer;
  pointer-events: auto;
  background: none;
  border: none;
  padding: var(--espaciado-xs);
  border-radius: var(--radio-sm);
  transition: var(--transicion-rapida);
}

.input-icon-clickable:hover {
  color: var(--color-primario);
  background: var(--color-primario-claro);
}

/* Feedback */
.input-feedback {
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
  font-size: 0.85rem;
  margin-top: var(--espaciado-xs);
}

.input-feedback i {
  font-size: 0.9rem;
}

.input-feedback-error {
  color: var(--color-peligro);
}

.input-feedback-hint {
  color: var(--color-texto-claro);
}

/* Disabled */
.input:disabled {
  background: var(--color-fondo-alterno);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Placeholder */
.input::placeholder {
  color: var(--color-texto-muy-claro);
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .input-lg {
    padding: var(--espaciado-md);
    font-size: 1rem;
  }
  
  .input-sm {
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