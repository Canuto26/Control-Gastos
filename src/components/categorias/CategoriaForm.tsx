// components/categorias/CategoriaForm.tsx
import React, { useState } from 'react';
import type { CategoriaFormData } from '../../types';

interface CategoriaFormProps {
  onCreateCategoria: (data: CategoriaFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
  onCreateCategoria,
  isLoading
}) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      await onCreateCategoria({ nombre });
      setNombre('');
      setError('');
    } catch (err) {
      setError('Error al crear categoría');
    }
  };

  return (
    <form className="form-categoria" onSubmit={handleSubmit} noValidate>
      <div className="campo-grupo">
        <label htmlFor="nombre-categoria" className="campo-label">
          <i className="fas fa-pen"></i>
          Nueva Categoría
        </label>
        <div className="campo-input-group">
          <input
            type="text"
            id="nombre-categoria"
            className="campo-input"
            placeholder="Ej: Alimentación, Transporte"
            maxLength={30}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            className="btn btn-primario btn-agregar-categoria"
            disabled={isLoading}
          >
            <i className="fas fa-plus"></i>
            {isLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
        {error && <div className="campo-error">{error}</div>}
        <small className="campo-ayuda">
          Máximo 30 caracteres
        </small>
      </div>
    </form>
  );
};