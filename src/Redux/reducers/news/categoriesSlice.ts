import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INewsCategory } from '../../../interfaces/rrhh/INews';

interface NewsCategoryState {
  newsCategories: INewsCategory[];
}

const initialState: NewsCategoryState = {
  newsCategories: [],
};

const newsCategorySlice = createSlice({
  name: 'NewsCategories',
  initialState,
  reducers: {
    setNewsCategoryList: (state, action: PayloadAction<INewsCategory[]>) => {
      state.newsCategories = action.payload;
    },
    addNewsCategory: (state, action: PayloadAction<INewsCategory>) => {
      state.newsCategories.push(action.payload);
    },
  },
});

export const { setNewsCategoryList, addNewsCategory } = newsCategorySlice.actions;

export default newsCategorySlice.reducer;
