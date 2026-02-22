// components/categorias/CategoriaList.tsx
import React from 'react';
import type { Categoria } from '../../types';
import { CategoriaItem } from './CategoriaItem';

interface CategoriaListProps {
  categorias: Categoria[];
  selectedCategoriaId?: string;
  onSelectCategoria?: (categoriaId: string) => void;
}

export const CategoriaList: React.FC<CategoriaListProps> = ({
  categorias,
  selectedCategoriaId,
  onSelectCategoria
}) => {
  return (
    <div className="categorias-container">
      <h3 className="sub-titulo">Categorías disponibles</h3>
      <ul className="categorias-lista" role="list">
        {categorias.map((categoria) => (
          <CategoriaItem
            key={categoria.id}
            categoria={categoria}
            isSelected={selectedCategoriaId === categoria.id}
            onSelect={onSelectCategoria}
          />
        ))}
      </ul>
    </div>
  );
};