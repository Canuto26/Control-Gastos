// components/estadisticas/EstadisticaCard.tsx
import React, { useEffect, useRef } from 'react';

export type EstadisticaColor = 'primario' | 'secundario' | 'exito' | 'peligro' | 'advertencia' | 'info';

interface EstadisticaCardProps {
  icono: string;
  label: string;
  valor: string | number;
  color?: EstadisticaColor;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export const EstadisticaCard: React.FC<EstadisticaCardProps> = ({
  icono,
  label,
  valor,
  color = 'primario',
  trend,
  delay = 0
}) => {
  const cardRef = useRef<HTMLElement>(null);

  // Animación de conteo para valores numéricos
  useEffect(() => {
    if (cardRef.current && typeof valor === 'number') {
      const valorElement = cardRef.current.querySelector('.estadistica-valor');
      if (valorElement) {
        // Aquí podrías implementar una animación de conteo
        // Por ahora solo aseguramos que se muestre formateado
      }
    }
  }, [valor]);

  // Mapa de colores para los iconos
  const colorMap = {
    primario: {
      bg: 'rgba(67, 97, 238, 0.1)',
      text: 'var(--color-primario)',
      gradient: 'linear-gradient(135deg, var(--color-primario), var(--color-primario-oscuro))'
    },
    secundario: {
      bg: 'rgba(114, 9, 183, 0.1)',
      text: 'var(--color-secundario)',
      gradient: 'linear-gradient(135deg, #7209b7, #560bad)'
    },
    exito: {
      bg: 'rgba(6, 214, 160, 0.1)',
      text: 'var(--color-exito)',
      gradient: 'linear-gradient(135deg, #06d6a0, #05b589)'
    },
    peligro: {
      bg: 'rgba(239, 71, 111, 0.1)',
      text: 'var(--color-peligro)',
      gradient: 'linear-gradient(135deg, #ef476f, #d63e62)'
    },
    advertencia: {
      bg: 'rgba(255, 209, 102, 0.1)',
      text: 'var(--color-advertencia)',
      gradient: 'linear-gradient(135deg, #ffd166, #f7b731)'
    },
    info: {
      bg: 'rgba(17, 138, 178, 0.1)',
      text: 'var(--color-info)',
      gradient: 'linear-gradient(135deg, #118ab2, #0e6f91)'
    }
  };

  const formatValor = (val: string | number): string => {
    if (typeof val === 'number') {
      // Si parece ser un monto en dinero (por el contexto)
      if (label.toLowerCase().includes('$') || 
          label.toLowerCase().includes('total') || 
          label.toLowerCase().includes('gastado')) {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(val);
      }
      // Si es un número de items
      return new Intl.NumberFormat('es-ES').format(val);
    }
    return val;
  };

  return (
    <article 
      ref={cardRef}
      className="estadistica-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div 
        className="estadistica-icono"
        style={{ 
          background: colorMap[color].bg,
          color: colorMap[color].text
        }}
      >
        <i className={`fas ${icono}`} aria-hidden="true"></i>
      </div>
      
      <div className="estadistica-info">
        <span className="estadistica-label">{label}</span>
        <span className="estadistica-valor">
          {formatValor(valor)}
        </span>
        
        {trend && (
          <div className={`estadistica-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`}></i>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </article>
  );
};

// Estilos específicos
const styles = `
.estadistica-card {
  background: rgba(255, 255, 255, 0.95);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: var(--radio-lg);
  padding: var(--espaciado-lg);
  display: flex;
  align-items: center;
  gap: var(--espaciado-lg);
  box-shadow: var(--sombra);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: var(--transicion-normal);
  animation: fadeInUp 0.6s ease;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
}

.estadistica-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primario), var(--color-secundario));
  opacity: 0;
  transition: var(--transicion-normal);
}

.estadistica-card:hover::before {
  opacity: 1;
}

.estadistica-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--sombra-hover);
}

.estadistica-icono {
  width: 60px;
  height: 60px;
  border-radius: var(--radio-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  transition: var(--transicion-normal);
}

.estadistica-card:hover .estadistica-icono {
  transform: scale(1.1) rotate(5deg);
}

.estadistica-info {
  flex: 1;
  position: relative;
}

.estadistica-label {
  display: block;
  font-size: 0.9rem;
  color: var(--color-texto-claro);
  font-weight: var(--peso-medium);
  margin-bottom: var(--espaciado-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estadistica-valor {
  display: block;
  font-size: 1.8rem;
  font-weight: var(--peso-bold);
  color: var(--color-texto);
  line-height: 1.2;
  transition: var(--transicion-rapida);
}

.estadistica-trend {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 20px;
  background: var(--color-fondo-alterno);
}

.estadistica-trend.positive {
  color: var(--color-exito);
}

.estadistica-trend.negative {
  color: var(--color-peligro);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .estadistica-card {
    padding: var(--espaciado-md);
  }
  
  .estadistica-icono {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .estadistica-valor {
    font-size: 1.5rem;
  }
  
  .estadistica-trend {
    position: static;
    margin-top: var(--espaciado-xs);
    display: inline-flex;
  }
}
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}