// components/layout/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  totalGeneral?: number;
  mostrarFooter?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  totalGeneral = 0,
  mostrarFooter = true,
  className = ''
}) => {
  return (
    <div className={`app-layout ${className}`}>
      <Header totalGeneral={totalGeneral} />
      
      <main className="app-main">
        <div className="contenedor">
          {children}
        </div>
      </main>

      {mostrarFooter && <Footer />}

      {/* Botón de scroll to top */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        <i className="fas fa-arrow-up" aria-hidden="true"></i>
      </button>
    </div>
  );
};

// Estilos específicos
const styles = `
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--espaciado-lg);
}

.app-main {
  flex: 1;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: var(--espaciado-xl);
  right: var(--espaciado-xl);
  width: 50px;
  height: 50px;
  border-radius: var(--radio-circular);
  background: linear-gradient(135deg, var(--color-primario), var(--color-primario-oscuro));
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: var(--sombra-fuerte);
  transition: var(--transicion-normal);
  z-index: var(--z-index-tooltip);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: var(--sombra-hover);
}

.scroll-to-top:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .app-layout {
    padding: var(--espaciado-md);
  }
  
  .scroll-to-top {
    bottom: var(--espaciado-md);
    right: var(--espaciado-md);
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .app-layout {
    padding: var(--espaciado-sm);
  }
}

/* Utilidades para transiciones de página */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s, transform 0.3s;
}

.page-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s, transform 0.3s;
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

// Hook para mostrar/ocultar el botón scroll to top
export const useScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  React.useEffect(() => {
    const button = document.querySelector('.scroll-to-top');
    if (button) {
      if (isVisible) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }
  }, [isVisible]);

  return isVisible;
};