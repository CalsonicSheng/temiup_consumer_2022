import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getTargetUserRequestHandler = createAsyncThunk('userSlice/getTargetUserRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getTargetUserRequestHandler run');
  try {
    const response = await axios.get(`/user`, { headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` } });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//----------------------------------------------------------------------------------------------------------------------------------------------

const updateTargetUserRequestHandler = createAsyncThunk('userSlice/updateTargetUserRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('updateTargetUserRequestHandler run');
  try {
    const response = await axios.put(`/user`, axiosParameter.requestBodyObject, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userSliceInitialState = {
  userState: {},
  isUserStateLoading: false,
  isCRUDLoading: false,
  CRUDResultState: {},
  userSliceJwtVerificationState: {},
  usernameState: localStorage.getItem('usernameLocalState') ? JSON.parse(localStorage.getItem('usernameLocalState')) : '',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: userSliceInitialState,
  reducers: {
    resetJwtVerificationStateHandler(state, action) {
      state.userSliceJwtVerificationState = {};
    },
    resetCRUDResultStateHandler(state, action) {
      state.CRUDResultState = {};
    },
  },

  //------------------------------------------------------------------------------------------------------

  extraReducers: {
    [getTargetUserRequestHandler.pending]: (state, action) => {
      state.isUserStateLoading = true;
    },
    [getTargetUserRequestHandler.fulfilled]: (state, action) => {
      state.isUserStateLoading = false;
      state.userState = { data: action.payload };
      state.usernameState = action.payload.username;
      localStorage.setItem('usernameLocalState', JSON.stringify(action.payload.username));
    },
    [getTargetUserRequestHandler.rejected]: (state, action) => {
      state.isUserStateLoading = false;
      if (action.payload.responseStatus === 401) {
        state.userSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.userState = { error: action.payload };
      }
    },

    //------------------------------------------------------------------------------------------------------

    [updateTargetUserRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },

    [updateTargetUserRequestHandler.fulfilled]: (state, action) => {
      state.isCRUDLoading = false;
      state.CRUDResultState = { data: 'success' };
      state.userState = { data: action.payload };
      state.usernameState = action.payload.username;
      localStorage.setItem('usernameLocalState', JSON.stringify(action.payload.username));
    },
    [updateTargetUserRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;
      if (action.payload.responseStatus === 401) {
        state.userSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.CRUDResultState = { error: action.payload };
      }
    },
  },
});

const userSliceSyncActions = userSlice.actions;

export default userSlice;
export { userSliceSyncActions, getTargetUserRequestHandler, updateTargetUserRequestHandler };
