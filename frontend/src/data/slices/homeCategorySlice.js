import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getCategoryListRequestHandler = createAsyncThunk('homeCategorySlice/getCategoryListRequestHandler', async function (dummyInput, { rejectWithValue }) {
  // console.log('getCategoryListRequestHandler run');
  try {
    const response = await axios.get(`/team`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const homeCategorySliceInitialState = {
  categoryList: {},
  selectedCategory: 'All',
};

const homeCategorySlice = createSlice({
  name: 'homeCategorySlice',
  initialState: homeCategorySliceInitialState,
  reducers: {
    categorySelectHandler(state, action) {
      state.selectedCategory = action.payload;
    },
    selectedCategoryResetHandler(state, action) {
      state.selectedCategory = 'All';
    },
  },
  extraReducers: {
    [getCategoryListRequestHandler.fulfilled]: (state, action) => {
      state.categoryList = { data: action.payload };
    },
    [getCategoryListRequestHandler.rejected]: (state, action) => {
      state.categoryList = { error: action.payload };
    },
  },
});

const homeCategorySliceSyncActions = homeCategorySlice.actions;

export default homeCategorySlice;
export { getCategoryListRequestHandler, homeCategorySliceSyncActions };
