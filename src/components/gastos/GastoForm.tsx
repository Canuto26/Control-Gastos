// components/gastos/GastoForm.tsx
import React, { useState, useEffect } from 'react';
import { GastoFormData, Categoria } from '../../types';

interface GastoFormProps {
  onSubmit: (data: GastoFormData) => Promise<void>;
  categorias: Categoria[];
  initialData?: GastoFormData;
  isEditing?: boolean;
  isLoading?: boolean;
}

const initialFormState: GastoFormData = {
  descripcion: '',
  monto: '',
  fechaHora: new Date().toISOString().slice(0, 16),
  categoriaId: ''
};

export const GastoForm: React.FC<GastoFormProps> = ({
  onSubmit,
  categorias,
  initialData,
  isEditing = false,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<GastoFormData>(
    initialData || initialFormState
  );
  const [errors, setErrors] = useState<Partial<Record<keyof GastoFormData, string>>>({});

  // Validación en tiempo real
  const validateField = (name: keyof GastoFormData, value: string | number) => {
    switch (name) {
      case 'descripcion':
        if (!value) return 'La descripción es requerida';
        if (String(value).length < 3) return 'Mínimo 3 caracteres';
        return '';
      case 'monto':
        if (!value) return 'El monto es requerido';
        const montoNum = Number(value);
        if (isNaN(montoNum)) return 'Debe ser un número válido';
        if (montoNum <= 0) return 'El monto debe ser positivo';
        return '';
      case 'categoriaId':
        if (!value) return 'Debes seleccionar una categoría';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo y actualizar errores
    const error = validateField(name as keyof GastoFormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: Partial<Record<keyof GastoFormData, string>> = {};
    (Object.keys(formData) as Array<keyof GastoFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convertir monto a número para enviar al backend
    const dataToSubmit = {
      ...formData,
      monto: Number(formData.monto)
    };

    await onSubmit(dataToSubmit);
    
    if (!isEditing) {
      setFormData(initialFormState);
    }
  };

  return (
    <form className="form-gasto" onSubmit={handleSubmit} noValidate>
      <div className="campo-grupo">
        <label htmlFor="descripcion" className="campo-label">
          <i className="fas fa-align-left"></i>
          Descripción <span className="requerido">*</span>
        </label>
        <input
          type="text"
          id="descripcion"
          name="descripcion"
          className="campo-input"
          placeholder="Ej: Compra de supermercado"
          maxLength={100}
          value={formData.descripcion}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        {errors.descripcion && (
          <div className="campo-error" role="alert">
            {errors.descripcion}
          </div>
        )}
      </div>

      <div className="campo-grupo">
        <label htmlFor="monto" className="campo-label">
          <i className="fas fa-dollar-sign"></i>
          Monto <span className="requerido">*</span>
        </label>
        <div className="campo-input-group">
          <span className="input-prefijo">$</span>
          <input
            type="number"
            id="monto"
            name="monto"
            className="campo-input campo-con-prefijo"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={formData.monto}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
        {errors.monto && (
          <div className="campo-error" role="alert">
            {errors.monto}
          </div>
        )}
      </div>

      <div className="campo-grupo">
        <label htmlFor="fecha-hora" className="campo-label">
          <i className="fas fa-calendar-clock"></i>
          Fecha y Hora
        </label>
        <input
          type="datetime-local"
          id="fecha-hora"
          name="fechaHora"
          className="campo-input"
          value={formData.fechaHora}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="campo-grupo">
        <label htmlFor="categoria-gasto" className="campo-label">
          <i className="fas fa-tag"></i>
          Categoría <span className="requerido">*</span>
        </label>
        <select
          name="categoriaId"
          id="categoria-gasto"
          className="campo-select"
          value={formData.categoriaId}
          onChange={handleChange}
          disabled={isLoading || categorias.length === 0}
          required
        >
          <option value="" disabled>
            {categorias.length === 0 
              ? 'Primero crea una categoría' 
              : '-- Selecciona una categoría --'}
          </option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errors.categoriaId && (
          <div className="campo-error" role="alert">
            {errors.categoriaId}
          </div>
        )}
      </div>

      <div className="form-acciones">
        <button
          type="submit"
          className="btn btn-primario btn-guardar-gasto"
          disabled={isLoading || categorias.length === 0}
        >
          <i className="fas fa-save"></i>
          {isLoading 
            ? 'Guardando...' 
            : isEditing 
              ? 'Actualizar Gasto' 
              : 'Guardar Gasto'}
        </button>
        {!isEditing && (
          <button
            type="button"
            className="btn btn-secundario btn-limpiar"
            onClick={() => setFormData(initialFormState)}
            disabled={isLoading}
          >
            <i className="fas fa-undo-alt"></i>
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
};