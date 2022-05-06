import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getTargetUserAddressesRequestHandler = createAsyncThunk('addressSlice/getTargetUserAddressesRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getTargetUserAddressesRequestHandler run');

  try {
    const response = await axios.get(`/address`, { headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` } });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const createTargetUserNewAddressRequestHandler = createAsyncThunk('addressSlice/createTargetUserNewAddressRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('createTargetUserNewAddressRequestHandler run');

  try {
    const response = await axios.post(`/address`, axiosParameter.requestBodyObject, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const updateTargetUserSelectedAddressRequestHandler = createAsyncThunk('addressSlice/updateTargetUserSelectedAddressRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('updateTargetUserSelectedAddressRequestHandler run');

  try {
    const response = await axios.put(`/address/${axiosParameter.selectedAddressId}`, axiosParameter.requestBodyObject, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteTargetUserSelectedAddressRequestHandler = createAsyncThunk('addressSlice/deleteTargetUserSelectedAddressRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('deleteTargetUserSelectedAddressRequestHandler run');

  try {
    const response = await axios.delete(`/address/${axiosParameter.selectedAddressId}`, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getTargetUserNewestAddressRequestHandler = createAsyncThunk('addressSlice/getTargetUserNewestAddressRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getTargetUserNewestAddressRequestHandler run');

  try {
    const response = await axios.get(`/address/newest`, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const addressSliceInitialState = {
  isAddressesStateLoading: false,
  isCRUDLoading: false,
  CRUDResultState: {},
  addressSliceJwtVerificationState: {},
  addressesState: {},
  newestAddressState: {},
};

const addressSlice = createSlice({
  name: 'addressSlice',
  initialState: addressSliceInitialState,
  reducers: {
    resetJwtVerificationStateHandler(state, action) {
      state.addressSliceJwtVerificationState = {};
    },
    resetCRUDResultStateHandler(state, action) {
      state.CRUDResultState = {};
    },
    // to reset the "newestAddressState" back to {} to make sure you always get the LATEST / NEWEST address EVERYIME BEFORE YOU CONDITIONALLY NAVIGATE TO orderConfirmation Page
    // without it, you flow for NEXT newly added address may NOT be reflect as previous "newestAddressState" is ALREADY in "data"
    resetNewestAddressHandler(state, action) {
      state.newestAddressState = {};
    },
  },

  extraReducers: {
    [getTargetUserAddressesRequestHandler.pending]: (state, action) => {
      state.isAddressesStateLoading = true;
    },
    [getTargetUserAddressesRequestHandler.fulfilled]: (state, action) => {
      state.isAddressesStateLoading = false;
      state.addressesState = { data: action.payload };
    },
    [getTargetUserAddressesRequestHandler.rejected]: (state, action) => {
      state.isAddressesStateLoading = false;

      if (action.payload.responseStatus === 401) {
        state.addressSliceJwtVerificationState = { error: action.payload };
      } else {
        state.addressesState = { error: action.payload };
      }
    },

    // ------------------------------------------------------------------------------------------------

    [createTargetUserNewAddressRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [createTargetUserNewAddressRequestHandler.fulfilled]: (state, action) => {
      state.isCRUDLoading = false;
      state.addressesState = { data: action.payload };
      state.CRUDResultState = { data: 'success' };
    },
    [createTargetUserNewAddressRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;

      if (action.payload.responseStatus === 401) {
        state.addressSliceJwtVerificationState = { error: action.payload };
      } else {
        state.CRUDResultState = { error: action.payload };
      }
    },

    // ------------------------------------------------------------------------------------------------

    [updateTargetUserSelectedAddressRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [updateTargetUserSelectedAddressRequestHandler.fulfilled]: (state, action) => {
      state.isCRUDLoading = false;
      state.addressesState = { data: action.payload };
      state.CRUDResultState = { data: 'success' };
    },
    [updateTargetUserSelectedAddressRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;

      if (action.payload.responseStatus === 401) {
        state.addressSliceJwtVerificationState = { error: action.payload };
      } else {
        state.CRUDResultState = { error: action.payload };
      }
    },

    // ------------------------------------------------------------------------------------------------

    [deleteTargetUserSelectedAddressRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [deleteTargetUserSelectedAddressRequestHandler.fulfilled]: (state, action) => {
      state.isCRUDLoading = false;
      state.addressesState = { data: action.payload };
      state.CRUDResultState = { data: 'success' }; // this CRUDResultState state for deletion operation will NOT be used, as this CRUD operation is triggered directly where the addressesState is shown
    },
    [deleteTargetUserSelectedAddressRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;

      if (action.payload.responseStatus === 401) {
        state.addressSliceJwtVerificationState = { error: action.payload };
      } else {
        state.CRUDResultState = { error: action.payload };
      }
    },

    // ------------------------------------------------------------------------------------------------

    [getTargetUserNewestAddressRequestHandler.fulfilled]: (state, action) => {
      state.newestAddressState = { data: action.payload };
    },
    [getTargetUserNewestAddressRequestHandler.rejected]: (state, action) => {
      if (action.payload.responseStatus === 401) {
        state.addressSliceJwtVerificationState = { error: action.payload };
      } else {
        state.newestAddressState = { error: action.payload };
      }
    },
  },
});

const addressSliceSyncActions = addressSlice.actions;

export default addressSlice;
export {
  addressSliceSyncActions,
  getTargetUserAddressesRequestHandler,
  createTargetUserNewAddressRequestHandler,
  updateTargetUserSelectedAddressRequestHandler,
  deleteTargetUserSelectedAddressRequestHandler,
  getTargetUserNewestAddressRequestHandler,
};
