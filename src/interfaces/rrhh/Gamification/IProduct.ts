export interface IProduct {
  id: number;
  pointsRequired: number;
  stock: number;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  img: string;
}

export interface IShoppingCartItem {
  qty: number;
  product: IProduct;
}
