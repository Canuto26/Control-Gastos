// components/layout/Header.tsx
import React from 'react';
import { useGastos } from '../../hooks/useGastos';

interface HeaderProps {
  totalGeneral: number;
}

export const Header: React.FC<HeaderProps> = ({ totalGeneral }) => {
  return (
    <header className="app-header" role="banner">
      <div className="contenedor">
        <div className="header-contenido">
          <div className="logo">
            <i className="fas fa-wallet" aria-hidden="true"></i>
            <h1>Control <span>Gastos</span></h1>
          </div>
          <div className="total-general">
            <span className="total-label">Total gastado</span>
            <span className="total-monto">
              ${totalGeneral.toFixed(2)}
            </span>
          </div>
          <button className="btn-menu-movil" aria-label="Menu">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};