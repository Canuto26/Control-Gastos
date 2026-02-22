// components/estadisticas/EstadisticasGrid.tsx
import React from 'react';
import { EstadisticaCard } from './EstadisticaCard';

interface EstadisticasGridProps {
  totalGastos: number;
  totalCategorias: number;
  gastosMes: number;
  promedioDia: number;
}

export const EstadisticasGrid: React.FC<EstadisticasGridProps> = ({
  totalGastos,
  totalCategorias,
  gastosMes,
  promedioDia
}) => {
  return (
    <section className="estadisticas-grid">
      <EstadisticaCard
        icono="fa-receipt"
        label="Total Gastos"
        valor={totalGastos.toString()}
        color="primario"
      />
      <EstadisticaCard
        icono="fa-tags"
        label="Categorías"
        valor={totalCategorias.toString()}
        color="secundario"
      />
      <EstadisticaCard
        icono="fa-calendar-alt"
        label="Este mes"
        valor={`$${gastosMes.toFixed(2)}`}
        color="exito"
      />
      <EstadisticaCard
        icono="fa-chart-line"
        label="Promedio/día"
        valor={`$${promedioDia.toFixed(2)}`}
        color="info"
      />
    </section>
  );
};