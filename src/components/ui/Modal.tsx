// components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
  initialFocusRef
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Guardar el elemento activo actual
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';

      // Enfocar el modal
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }

      // Manejar tecla ESC
      const handleEsc = (e: KeyboardEvent) => {
        if (closeOnEsc && e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = '';

      // Restaurar el foco al elemento anterior
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, closeOnEsc, onClose, initialFocusRef]);

  if (!isOpen) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  const baseClass = 'modal';
  const sizeClass = `modal-${size}`;

  const modalClasses = [
    baseClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className="modal-overlay"
      onClick={handleClickOutside}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        <div className="modal-content">
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && (
                <h3 id="modal-title" className="modal-title">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  className="modal-close-button"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              )}
            </div>
          )}

          <div className="modal-body">{children}</div>

          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

// Estilos específicos
const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  animation: fadeIn 0.3s ease;
  padding: var(--espaciado-md);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  border-radius: var(--radio-xl);
  box-shadow: var(--sombra-fuerte);
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  width: 100%;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tamaños */
.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 500px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1140px;
}

.modal-full {
  max-width: calc(100vw - var(--espaciado-xxl));
  height: calc(100vh - var(--espaciado-xxl));
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  padding: var(--espaciado-lg);
  border-bottom: 2px solid var(--color-borde-claro);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(67, 97, 238, 0.02), transparent);
  border-radius: var(--radio-xl) var(--radio-xl) 0 0;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: var(--peso-semibold);
  color: var(--color-texto);
  margin: 0;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-texto-claro);
  transition: var(--transicion-rapida);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radio-circular);
}

.modal-close-button:hover {
  color: var(--color-peligro);
  background: var(--color-fondo-alterno);
  transform: scale(1.1);
}

.modal-close-button:focus-visible {
  outline: 2px solid var(--color-primario);
  outline-offset: 2px;
}

.modal-body {
  padding: var(--espaciado-lg);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--espaciado-lg);
  border-top: 2px solid var(--color-borde-claro);
  background: var(--color-fondo-alterno);
  border-radius: 0 0 var(--radio-xl) var(--radio-xl);
  display: flex;
  justify-content: flex-end;
  gap: var(--espaciado-md);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-full {
    max-width: 100vw;
    height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl {
    max-width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: var(--espaciado-md);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: var(--espaciado-sm);
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}