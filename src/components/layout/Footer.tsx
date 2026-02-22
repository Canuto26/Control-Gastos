// components/layout/Footer.tsx
import React from 'react';

interface FooterProps {
  año?: number;
  mostrarLinks?: boolean;
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({
  año = new Date().getFullYear(),
  mostrarLinks = true,
  version = '1.0.0'
}) => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="contenedor">
        <div className="footer-contenido">
          <div className="footer-info">
            <p className="footer-copyright">
              <i className="fas fa-copyright" aria-hidden="true"></i>
              {año} ControlGastos. Todos los derechos reservados
            </p>
            <p className="footer-hecho">
              Desarrollado con <i className="fas fa-heart" aria-hidden="true"></i> 
              <span className="sr-only">amor</span> para la gestión financiera
            </p>
            {version && (
              <p className="footer-version">
                <i className="fas fa-code-branch" aria-hidden="true"></i>
                v{version}
              </p>
            )}
          </div>

          {mostrarLinks && (
            <div className="footer-links">
              <a 
                href="#" 
                className="footer-link"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-file-contract"></i>
                Términos de uso
              </a>
              <span className="separador" aria-hidden="true">|</span>
              <a 
                href="#" 
                className="footer-link"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-lock"></i>
                Privacidad
              </a>
              <span className="separador" aria-hidden="true">|</span>
              <a 
                href="#" 
                className="footer-link"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question-circle"></i>
                Ayuda
              </a>
            </div>
          )}
        </div>

        <div className="footer-estadisticas">
          <small>
            <i className="fas fa-database"></i>
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </small>
        </div>
      </div>
    </footer>
  );
};

// Estilos específicos
const styles = `
.app-footer {
  margin-top: var(--espaciado-xxl);
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: var(--radio-xl) var(--radio-xl) 0 0;
  padding: var(--espaciado-lg) 0;
  border-top: 1px solid rgba(67, 97, 238, 0.1);
  box-shadow: 0 -10px 30px -5px rgba(0, 0, 0, 0.05);
}

.footer-contenido {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--espaciado-lg);
  color: var(--color-texto-claro);
  font-size: 0.9rem;
  margin-bottom: var(--espaciado-md);
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: var(--espaciado-xs);
}

.footer-copyright {
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
}

.footer-hecho {
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
  font-size: 0.85rem;
}

.footer-hecho i {
  color: var(--color-peligro);
  animation: latido 1.5s ease infinite;
}

.footer-version {
  font-size: 0.8rem;
  color: var(--color-texto-muy-claro);
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
  margin-top: var(--espaciado-xs);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--espaciado-sm);
  flex-wrap: wrap;
}

.footer-link {
  color: var(--color-texto-claro);
  text-decoration: none;
  transition: var(--transicion-rapida);
  display: inline-flex;
  align-items: center;
  gap: var(--espaciado-xs);
  padding: var(--espaciado-xs) var(--espaciado-sm);
  border-radius: var(--radio-sm);
}

.footer-link:hover {
  color: var(--color-primario);
  background: var(--color-primario-claro);
  transform: translateY(-2px);
}

.footer-link i {
  font-size: 0.85rem;
}

.separador {
  color: var(--color-texto-muy-claro);
  font-weight: var(--peso-light);
}

.footer-estadisticas {
  text-align: center;
  padding-top: var(--espaciado-md);
  border-top: 1px dashed var(--color-borde-claro);
  font-size: 0.8rem;
  color: var(--color-texto-muy-claro);
}

.footer-estadisticas i {
  margin-right: var(--espaciado-xs);
}

@keyframes latido {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-contenido {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-info {
    align-items: center;
  }
  
  .footer-links {
    justify-content: center;
  }
  
  .footer-copyright,
  .footer-hecho {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: var(--espaciado-sm);
  }
  
  .separador {
    display: none;
  }
  
  .footer-link {
    width: 100%;
    justify-content: center;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}