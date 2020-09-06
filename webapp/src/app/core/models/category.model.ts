export interface ICategory {
  id: number;
  name: string;
  description?: string;
  storeId?: number;
  createdAt: number;
  isActive?: boolean;
}

export interface ICategoryBody {
  name: string;
}
