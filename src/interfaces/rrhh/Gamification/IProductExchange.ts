export interface IProductExchange {
  products: ProductExhange[];
}

export interface ProductExhange {
  id: number;
  pointsRequired: number;
  quantity: number;
}

export interface IExchange {
  totalExchangeSum: number;
  exchangesDetail: IExchangeHeader[];
}
export interface IExchangeHeader {
  id: number;
  cdtId: number;
  cdtName: string;
  status: string;
  userName: string;
  userId: string;
  createdAt: string;
  detail: IExchangeDetail[];
}

export interface IExchangeDetail {
  id: number;
  productName: string;
  quantity: number;
  pointsRequired: number;
}
