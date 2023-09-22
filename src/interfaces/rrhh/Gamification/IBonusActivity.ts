export interface IBonusActivity {
  id: number;
  name: string;
  points: number;
  status: boolean;
}
export interface IExtraBonusActivity {
  id: number;
  name: string;
  multiplier: number;
  status: boolean;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
