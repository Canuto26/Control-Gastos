// components/gastos/GastoResumen.tsx
import React from 'react';

interface GastoResumenProps {
  totalAcumulado: number;
  conteoGastos: number;
  presupuestoLimite?: number;
  mostrarPorcentaje?: boolean;
}

export const GastoResumen: React.FC<GastoResumenProps> = ({
  totalAcumulado,
  conteoGastos,
  presupuestoLimite,
  mostrarPorcentaje = true
}) => {
  const porcentajeUsado = presupuestoLimite 
    ? (totalAcumulado / presupuestoLimite) * 100 
    : null;

  const getPorcentajeColor = (): string => {
    if (!porcentajeUsado) return '';
    if (porcentajeUsado >= 90) return 'peligro';
    if (porcentajeUsado >= 70) return 'advertencia';
    return 'exito';
  };

  const formatMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  return (
    <div className="resumen-gastos">
      <div className="resumen-principal">
        <div className="total-acumulado">
          <span className="total-label">
            <i className="fas fa-chart-pie"></i>
            Total acumulado
          </span>
          <span className="total-valor">
            {formatMoneda(totalAcumulado)}
          </span>
        </div>

        <div className="conteo-gastos">
          <span className="conteo-label">
            <i className="fas fa-receipt"></i>
            Gastos registrados:
          </span>
          <span className="conteo-valor">{conteoGastos}</span>
        </div>
      </div>

      {presupuestoLimite && mostrarPorcentaje && (
        <div className="resumen-presupuesto">
          <div className="presupuesto-info">
            <span className="presupuesto-label">
              Presupuesto: {formatMoneda(presupuestoLimite)}
            </span>
            <span className={`presupuesto-porcentaje ${getPorcentajeColor()}`}>
              {porcentajeUsado?.toFixed(1)}% usado
            </span>
          </div>
          
          <div className="barra-progreso">
            <div 
              className={`barra-progreso-llenado ${getPorcentajeColor()}`}
              style={{ width: `${Math.min(porcentajeUsado || 0, 100)}%` }}
              role="progressbar"
              aria-valuenow={porcentajeUsado || 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="sr-only">
                {porcentajeUsado?.toFixed(1)}% del presupuesto utilizado
              </span>
            </div>
          </div>

          {porcentajeUsado && porcentajeUsado > 100 && (
            <div className="presupuesto-alerta">
              <i className="fas fa-exclamation-triangle"></i>
              Has excedido el presupuesto en {formatMoneda(totalAcumulado - presupuestoLimite)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Estilos específicos
const styles = `
.resumen-gastos {
  display: flex;
  flex-direction: column;
  gap: var(--espaciado-lg);
  padding: var(--espaciado-md) var(--espaciado-lg);
  background: linear-gradient(135deg, var(--color-primario-claro) 0%, white 100%);
  border-radius: var(--radio-lg);
  margin-bottom: var(--espaciado-lg);
  border: 1px solid rgba(67, 97, 238, 0.1);
}

.resumen-principal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--espaciado-md);
}

.total-acumulado,
.conteo-gastos {
  display: flex;
  align-items: center;
  gap: var(--espaciado-sm);
}

.total-label,
.conteo-label {
  display: flex;
  align-items: center;
  gap: var(--espaciado-xs);
  font-weight: var(--peso-medium);
  color: var(--color-texto-claro);
  font-size: 0.95rem;
}

.total-label i,
.conteo-label i {
  color: var(--color-primario);
  font-size: 1rem;
}

.total-valor {
  font-weight: var(--peso-bold);
  font-size: 1.5rem;
  color: var(--color-primario);
  letter-spacing: -0.5px;
}

.conteo-valor {
  font-weight: var(--peso-bold);
  font-size: 1.3rem;
  color: var(--color-texto);
}

.resumen-presupuesto {
  border-top: 1px solid var(--color-borde-claro);
  padding-top: var(--espaciado-md);
}

.presupuesto-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--espaciado-sm);
  font-size: 0.9rem;
}

.presupuesto-label {
  color: var(--color-texto-claro);
}

.presupuesto-porcentaje {
  font-weight: var(--peso-semibold);
  padding: 2px 8px;
  border-radius: 20px;
}

.presupuesto-porcentaje.exito {
  background: rgba(6, 214, 160, 0.1);
  color: var(--color-exito);
}

.presupuesto-porcentaje.advertencia {
  background: rgba(255, 209, 102, 0.1);
  color: var(--color-advertencia);
}

.presupuesto-porcentaje.peligro {
  background: rgba(239, 71, 111, 0.1);
  color: var(--color-peligro);
}

.barra-progreso {
  width: 100%;
  height: 8px;
  background: var(--color-fondo-alterno);
  border-radius: 20px;
  overflow: hidden;
}

.barra-progreso-llenado {
  height: 100%;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.barra-progreso-llenado.exito {
  background: linear-gradient(90deg, var(--color-exito), #06d6a0);
}

.barra-progreso-llenado.advertencia {
  background: linear-gradient(90deg, var(--color-advertencia), #ffd166);
}

.barra-progreso-llenado.peligro {
  background: linear-gradient(90deg, var(--color-peligro), #ef476f);
}

.presupuesto-alerta {
  margin-top: var(--espaciado-sm);
  padding: var(--espaciado-sm) var(--espaciado-md);
  background: rgba(239, 71, 111, 0.1);
  border-left: 4px solid var(--color-peligro);
  border-radius: var(--radio-sm);
  color: var(--color-peligro);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: var(--espaciado-sm);
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

@media (max-width: 768px) {
  .resumen-principal {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .total-valor {
    font-size: 1.3rem;
  }
  
  .conteo-valor {
    font-size: 1.1rem;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}