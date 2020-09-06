import { ICategory } from './category.model';

export interface IProduct {
  id: number;
  name: string;
  price: number;
  // Quantity in warehouser
  quantity: number;
  // Quantity in store
  storeName?: string;
  storeProductQuantity?: number;
  createdAt?: number;
  categories?: ICategory[],
  categoryNames?: string[],
  imgUrl?: string;
  productId?: number;
  cartItemId?: number;
  storeId?: number;
}

export interface IProductBody {
  name: string;
  price: number;
  quantity?: number;
  storeId?: number;
  categories: number[]
}