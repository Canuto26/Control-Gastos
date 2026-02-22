// types/index.ts

export interface Categoria {
  id: string;              // UUID de Prisma
  nombre: string;
  _count?: {               // Para el conteo de gastos
    gastos: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Gasto {
  id: string;              // UUID de Prisma
  descripcion: string;
  monto: number;           // Decimal en Prisma, number en TS
  fechaHora: string;       // ISO string (ej: "2024-01-15T18:30:00")
  categoriaId: string;
  categoria?: Categoria;    // Populado si hacemos join
  createdAt?: string;
  updatedAt?: string;
}

export interface GastoFormData {
  descripcion: string;
  monto: number | string;   // Permite string del input
  fechaHora: string;
  categoriaId: string;
}

export interface CategoriaFormData {
  nombre: string;
}

export interface GastoFilters {
  page?: number;
  limit?: number;
  sortBy?: keyof Gasto;
  sortOrder?: 'asc' | 'desc';
  categoriaId?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}