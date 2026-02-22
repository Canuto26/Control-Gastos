// components/ui/LoadingSpinner.tsx
import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primario' | 'secundario' | 'blanco' | 'gris';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primario',
  fullScreen = false,
  overlay = false,
  text,
  className = ''
}) => {
  const baseClass = 'spinner';
  const sizeClass = `spinner-${size}`;
  const variantClass = `spinner-${variant}`;

  const spinnerClasses = [
    baseClass,
    sizeClass,
    variantClass,
    className
  ].filter(Boolean).join(' ');

  if (fullScreen || overlay) {
    return (
      <div className={`spinner-container ${overlay ? 'spinner-overlay' : ''} ${fullScreen ? 'spinner-fullscreen' : ''}`}>
        <div className="spinner-wrapper">
          <div className={spinnerClasses} role="status" aria-label="Cargando">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-inline">
      <div className={spinnerClasses} role="status" aria-label="Cargando">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {text && <span className="spinner-text spinner-text-inline">{text}</span>}
    </div>
  );
};

// Estilos específicos
const styles = `
/* Spinner inline */
.spinner-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--espaciado-sm);
}

/* Spinner container */
.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  z-index: var(--z-index-modal);
  min-height: auto;
}

.spinner-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-modal);
}

.spinner-wrapper {
  text-align: center;
}

/* Spinner animation */
.spinner {
  display: inline-flex;
  gap: calc(var(--espaciado-sm) / 2);
  align-items: center;
  justify-content: center;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  background-color: currentColor;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner .spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner .spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner .spinner-circle:nth-child(3) {
  animation-delay: 0;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Tamaños */
.spinner-xs {
  width: 30px;
  height: 30px;
}

.spinner-xs .spinner-circle {
  width: 6px;
  height: 6px;
}

.spinner-sm {
  width: 40px;
  height: 40px;
}

.spinner-sm .spinner-circle {
  width: 8px;
  height: 8px;
}

.spinner-md {
  width: 60px;
  height: 60px;
}

.spinner-md .spinner-circle {
  width: 12px;
  height: 12px;
}

.spinner-lg {
  width: 80px;
  height: 80px;
}

.spinner-lg .spinner-circle {
  width: 16px;
  height: 16px;
}

.spinner-xl {
  width: 100px;
  height: 100px;
}

.spinner-xl .spinner-circle {
  width: 20px;
  height: 20px;
}

/* Variantes de color */
.spinner-primario {
  color: var(--color-primario);
}

.spinner-secundario {
  color: var(--color-secundario);
}

.spinner-blanco {
  color: white;
}

.spinner-gris {
  color: var(--color-texto-claro);
}

/* Texto del spinner */
.spinner-text {
  margin-top: var(--espaciado-md);
  color: var(--color-texto-claro);
  font-size: 0.95rem;
  animation: fadeIn 1s ease;
}

.spinner-text-inline {
  margin-top: 0;
  margin-left: var(--espaciado-sm);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .spinner-lg {
    width: 60px;
    height: 60px;
  }
  
  .spinner-xl {
    width: 80px;
    height: 80px;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}