// components/ui/ConfirmModal.tsx
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export type ConfirmVariant = 'peligro' | 'advertencia' | 'info' | 'exito';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  showCancelButton?: boolean;
  icon?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'peligro',
  isLoading = false,
  showCancelButton = true,
  icon
}) => {
  const variantMap = {
    peligro: {
      icon: <i className="fas fa-exclamation-triangle"></i>,
      confirmVariant: 'peligro' as const,
      titleIcon: 'fa-exclamation-circle'
    },
    advertencia: {
      icon: <i className="fas fa-exclamation-circle"></i>,
      confirmVariant: 'advertencia' as const,
      titleIcon: 'fa-exclamation-triangle'
    },
    info: {
      icon: <i className="fas fa-info-circle"></i>,
      confirmVariant: 'info' as const,
      titleIcon: 'fa-question-circle'
    },
    exito: {
      icon: <i className="fas fa-check-circle"></i>,
      confirmVariant: 'exito' as const,
      titleIcon: 'fa-check-circle'
    }
  };

  const currentVariant = variantMap[variant];

  const footer = (
    <>
      {showCancelButton && (
        <Button
          variant="secundario"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      )}
      <Button
        variant={currentVariant.confirmVariant}
        onClick={onConfirm}
        isLoading={isLoading}
        icon={<i className={`fas ${variantMap[variant].titleIcon}`} />}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={footer}
      size="sm"
      closeOnClickOutside={!isLoading}
      closeOnEsc={!isLoading}
    >
      <div className="confirm-modal-content">
        <div className={`confirm-modal-icon confirm-modal-icon-${variant}`}>
          {icon || currentVariant.icon}
        </div>
        <p className="confirm-modal-message">{message}</p>
      </div>
    </Modal>
  );
};

// Estilos específicos
const styles = `
.confirm-modal-content {
  text-align: center;
  padding: var(--espaciado-md) 0;
}

.confirm-modal-icon {
  font-size: 4rem;
  margin-bottom: var(--espaciado-lg);
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.confirm-modal-icon-peligro {
  color: var(--color-peligro);
}

.confirm-modal-icon-advertencia {
  color: var(--color-advertencia);
}

.confirm-modal-icon-info {
  color: var(--color-info);
}

.confirm-modal-icon-exito {
  color: var(--color-exito);
}

.confirm-modal-message {
  font-size: 1.1rem;
  color: var(--color-texto);
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .confirm-modal-icon {
    font-size: 3rem;
  }
  
  .confirm-modal-message {
    font-size: 1rem;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}