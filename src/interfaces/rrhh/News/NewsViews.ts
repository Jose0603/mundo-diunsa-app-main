// Generated by https://quicktype.io

export interface NewsViews {
  totalNews: number;
  totalReadPercent: number;
  detail: Detail[];
}

export interface Detail {
  category: string;
  quantityRead: number;
  readPercent: number;
}
