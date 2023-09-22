import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IExchange, IExchangeHeader } from '../../../interfaces/rrhh/Gamification/IProductExchange';

interface CouponExchangeState {
  exchanges: IExchangeHeader[] | undefined;
  totalExchangeSum: number;
}

const initialState: CouponExchangeState = {
  exchanges: undefined,
  totalExchangeSum: 0,
};

const couponExchangeSlice = createSlice({
  name: 'CouponExchange',
  initialState,
  reducers: {
    setCouponExchanges: (state, action: PayloadAction<IExchange>) => {
      state.exchanges = action.payload.exchangesDetail;
      state.totalExchangeSum = action.payload.totalExchangeSum;
    },
  },
});

export const { setCouponExchanges } = couponExchangeSlice.actions;

export default couponExchangeSlice.reducer;
