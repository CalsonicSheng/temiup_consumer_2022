import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userRegisterRequestHandler = createAsyncThunk('authSlice/userRegisterRequestHandler', async function (registerInput, { rejectWithValue }) {
  try {
    const response = await axios.post(`/auth/register`, registerInput);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

const userSiginRequestHandler = createAsyncThunk('authSlice/userSiginRequestHandler', async function (signinInput, { rejectWithValue }) {
  try {
    const response = await axios.post(`/auth/signin`, signinInput);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const authSliceInitialState = {
  authState: localStorage.getItem('authLocalState') ? { data: JSON.parse(localStorage.getItem('authLocalState')) } : {},
  isAuthStateLoading: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState: authSliceInitialState,
  reducers: {
    // this operation is called when jwt verification process fails | people logout | when auth is error state
    // no need to conduct "removeItem" method on "savedTeamCountLocalState" since we always want to preserve and remind user number of teams you saved last time even when you logout
    authResetOrLogoutHandler(state, action) {
      state.authState = {};
      localStorage.removeItem('authLocalState');
      localStorage.removeItem('usernameLocalState');
      localStorage.removeItem('orderContactEmailLocalState');
      localStorage.removeItem('orderShippingAddressLocalState');
      localStorage.removeItem('selectedQtyLocalState');
      localStorage.removeItem('otherSpecificationLocalState');
    },
  },

  extraReducers: {
    [userRegisterRequestHandler.pending]: (state, action) => {
      state.isAuthStateLoading = true;
    },
    [userRegisterRequestHandler.fulfilled]: (state, action) => {
      state.isAuthStateLoading = false;
      state.authState = { data: action.payload };
      localStorage.setItem('authLocalState', JSON.stringify(action.payload));
    },
    [userRegisterRequestHandler.rejected]: (state, action) => {
      state.isAuthStateLoading = false;
      state.authState = { error: action.payload };
    },

    //-----------------------------------------------------------------------------

    [userSiginRequestHandler.pending]: (state, action) => {
      state.isAuthStateLoading = true;
    },
    [userSiginRequestHandler.fulfilled]: (state, action) => {
      state.isAuthStateLoading = false;
      state.authState = { data: action.payload };
      localStorage.setItem('authLocalState', JSON.stringify(action.payload));
    },
    [userSiginRequestHandler.rejected]: (state, action) => {
      state.isAuthStateLoading = false;
      state.authState = { error: action.payload };
    },
  },
});

const authSliceSyncActions = authSlice.actions;

export default authSlice;
export { userRegisterRequestHandler, userSiginRequestHandler, authSliceSyncActions };
