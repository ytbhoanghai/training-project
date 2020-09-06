import { IProduct } from './product.model';
import { ICategory } from './category.model';

export interface IPageableProduct {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  products: IProduct[];
}

export interface IShoppingProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeName: string;
  categoryNames: string[];
}

export interface ICart {
  id?: number;
  createdAt?: number;
  totalPrice?: number;
  items: ICartItem[];
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  storeProductQuantity?: number;
  createdAt?: number;
  categories?: ICategory[];
  productId?: number;
  storeId?: number;
  storeName?: string;
}

export interface ICartItemBody {
  idCartItem: number;
  quantity: number;
}

export interface IMergeCartBody {
  productId: number;
  quantity: number;
  storeId: number;
}

export interface IOrder {
  id: number;
  totalPrice: number;
  createdAt: number;
  phone: string;
  shipAddress: string;
  transactionId: string;
  status: string;
}

export interface IProductFilter {
  params: {
    storeId: number;
    categoryId: number;
  };
  query?: {
    page: number;
    size?: number;
    search?: string;
  };
}

export interface ICustomerBody {
  name: string;
  email: string;
  address: string;
  username: string;
  password: string;
}
