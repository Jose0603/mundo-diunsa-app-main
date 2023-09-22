import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IShoppingCartItem } from '../../../interfaces/rrhh/Gamification/IProduct';

interface ShoppingCartState {
  products: IShoppingCartItem[];
  totalCart: number;
  totalCartItems: number;
}

const initialState: ShoppingCartState = {
  products: [],
  totalCart: 0,
  totalCartItems: 0,
};

const calculateTotalItems = (products: IShoppingCartItem[]) => {
  return products.reduce((partialSum, item) => partialSum + item.qty, 0);
};

const calculateTotalCost = (products: IShoppingCartItem[]) => {
  return products.reduce(
    (acc: number, cartItem: IShoppingCartItem): number => acc + cartItem.qty * cartItem.product.pointsRequired,
    0
  );
};

const storeSlice = createSlice({
  name: 'Store',
  initialState,
  reducers: {
    resetProductList: (state) => {
      state.products = [];
      state.totalCart = 0;
      state.totalCartItems = 0;
    },
    addProductQty: (state, action: PayloadAction<IShoppingCartItem>) => {
      let itemIndex = state.products.findIndex((item) => item.product.id === action.payload.product.id);
      if (itemIndex !== -1) {
        state.products[itemIndex].qty += action.payload.qty;
      } else {
        state.products.push(action.payload);
      }
      state.totalCart = calculateTotalCost(state.products);
      state.totalCartItems = calculateTotalItems(state.products);
    },
    substractProductQty: (state, action: PayloadAction<IShoppingCartItem>) => {
      let itemIndex = state.products.findIndex((item) => item.product.id === action.payload.product.id);
      if (itemIndex !== -1 && state.products[itemIndex].qty > 0) {
        state.products[itemIndex].qty -= action.payload.qty;
        if (state.products[itemIndex].qty == 0) {
          state.products.splice(itemIndex, 1);
        }
      } else {
        state.products.splice(itemIndex, 1);
      }
      state.totalCart = calculateTotalCost(state.products);
      state.totalCartItems = calculateTotalItems(state.products);
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      const newArray = state.products.filter((item) => item.product.id !== action.payload);
      state.products = newArray;

      state.totalCart = calculateTotalCost(state.products);
      state.totalCartItems = calculateTotalItems(state.products);
    },
  },
});

export const { resetProductList, deleteProduct, addProductQty, substractProductQty } = storeSlice.actions;

export default storeSlice.reducer;
