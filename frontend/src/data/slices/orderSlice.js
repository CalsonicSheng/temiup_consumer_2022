import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getTargetUserOrderRequestHandler = createAsyncThunk('orderSlice/getTargetUserOrderRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getTargetUserOrderRequestHandler run');
  try {
    const response = await axios.get(`/order`, { headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` } });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const joinTeamAndCreateNewOrderRequestHandler = createAsyncThunk('orderSlice/joinTeamAndCreateNewOrderRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('joinTeamAndCreateNewOrderRequestHandler run');
  try {
    const response = await axios.post(`/order/${axiosParameter.selectedTeamId}`, axiosParameter.requestBodyObject, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const orderSliceInitialState = {
  isOrdersStateLoading: false,
  isCRUDLoading: false,
  CRUDResultState: {},
  orderSliceJwtVerificationState: {},
  ordersState: {},
  newlyPlacedOrderState: {}, // this is used in the orderScreen (to show the order result)
  orderContactEmailState: localStorage.getItem('orderContactEmailLocalState') ? JSON.parse(localStorage.getItem('orderContactEmailLocalState')) : '',
  orderShippingAddressState: localStorage.getItem('orderShippingAddressLocalState') ? JSON.parse(localStorage.getItem('orderShippingAddressLocalState')) : {},
  otherSpecificationState: localStorage.getItem('otherSpecificationLocalState') ? JSON.parse(localStorage.getItem('otherSpecificationLocalState')) : {},
  selectedQtyState: localStorage.getItem('selectedQtyLocalState') ? JSON.parse(localStorage.getItem('selectedQtyLocalState')) : 1,
};

const orderSlice = createSlice({
  name: 'orderSlice',
  initialState: orderSliceInitialState,
  reducers: {
    resetJwtVerificationStateHandler(state, action) {
      state.orderSliceJwtVerificationState = {};
    },

    resetCRUDResultStateHandler(state, action) {
      state.CRUDResultState = {};
    },

    resetSelectedQtyStateHandler(state, action) {
      state.selectedQtyState = 1;
      localStorage.setItem('selectedQtyLocalState', JSON.stringify(1));
    },

    setSelectedQtyStateHandler(state, action) {
      state.selectedQtyState = action.payload;
      localStorage.setItem('selectedQtyLocalState', JSON.stringify(action.payload));
    },

    setOrderContactEmailStateHandler(state, action) {
      state.orderContactEmailState = action.payload;
      localStorage.setItem('orderContactEmailLocalState', JSON.stringify(action.payload));
    },

    setOrderShippingAddressStateHandler(state, action) {
      state.orderShippingAddressState = action.payload;
      localStorage.setItem('orderShippingAddressLocalState', JSON.stringify(action.payload));
    },

    setOtherSpecificationStateHandler(state, action) {
      state.otherSpecificationState = action.payload;
      localStorage.setItem('otherSpecificationLocalState', JSON.stringify(action.payload));
    },
  },

  extraReducers: {
    [getTargetUserOrderRequestHandler.pending]: (state, action) => {
      state.isOrdersStateLoading = true;
    },
    [getTargetUserOrderRequestHandler.fulfilled]: (state, action) => {
      state.isOrdersStateLoading = false;
      state.ordersState = { data: action.payload };
    },
    [getTargetUserOrderRequestHandler.rejected]: (state, action) => {
      state.isOrdersStateLoading = false;
      if (action.payload.responseStatus === 401) {
        state.orderSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.ordersState = { error: action.payload };
      }
    },

    // --------------------------------------------------------------------------------------------

    [joinTeamAndCreateNewOrderRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [joinTeamAndCreateNewOrderRequestHandler.fulfilled]: (state, action) => {
      state.isCRUDLoading = false;
      state.CRUDResultState = { data: 'success' };
      state.newlyPlacedOrderState = { data: action.payload };
    },
    [joinTeamAndCreateNewOrderRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;
      if (action.payload.responseStatus === 401) {
        state.orderSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.CRUDResultState = { error: action.payload };
      }
    },
  },
});

const orderSliceSyncActions = orderSlice.actions;
export default orderSlice;
export { orderSliceSyncActions, getTargetUserOrderRequestHandler, joinTeamAndCreateNewOrderRequestHandler };
