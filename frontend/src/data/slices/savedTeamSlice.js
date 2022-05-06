import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getSavedTeamsRequestHandler = createAsyncThunk('savedTeamSlice/getSavedTeamsRequestHandler', async function (dummyInput, { rejectWithValue }) {
  console.log('getSavedTeamsRequestHandler run');
  try {
    const response = await axios.get('/saved-team', { headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` } });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const saveTeamRequestHandler = createAsyncThunk('savedTeamSlice/saveTeamRequestHandler', async function (selectedTeamObject, { rejectWithValue }) {
  console.log('saveTeamRequestHandler run');
  try {
    const response = await axios.post('/saved-team', selectedTeamObject, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteOneSavedTeamsRequestHandler = createAsyncThunk('savedTeamSlice/deleteOneSavedTeamsRequestHandler', async function (selectedTeamId, { rejectWithValue }) {
  console.log('deleteOneSavedTeamsRequestHandler run');
  try {
    const response = await axios.delete(`/saved-team/${selectedTeamId}`, {
      headers: { token: `Bearer ${localStorage.getItem('authLocalState') && JSON.parse(localStorage.getItem('authLocalState')).token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const savedTeamSliceInitialState = {
  isSavedTeamsStateLoading: false,
  isCRUDLoading: false,
  CRUDResultState: {},
  savedTeamSliceJwtVerificationState: {},
  savedTeamsState: {},
  savedTeamCountState: localStorage.getItem('savedTeamCountLocalState') ? JSON.parse(localStorage.getItem('savedTeamCountLocalState')) : 0,
};

//--------------------------------------------------------------------------------------

const savedTeamSlice = createSlice({
  name: 'savedTeamSlice',
  initialState: savedTeamSliceInitialState,
  reducers: {
    resetJwtVerificationStateHandler(state, action) {
      state.savedTeamSliceJwtVerificationState = {};
    },
    resetCRUDResultStateHandler(state, action) {
      state.CRUDResultState = {};
    },
  },
  // update totalSavedTeamCountState as well as store it in localstorage for every success axios request, this is to keep localstorage in sync with backend
  extraReducers: {
    [getSavedTeamsRequestHandler.pending]: (state, action) => {
      state.isSavedTeamsStateLoading = true;
    },
    [getSavedTeamsRequestHandler.fulfilled]: (state, action) => {
      state.isSavedTeamsStateLoading = false;
      state.savedTeamsState = { data: action.payload };
    },
    [getSavedTeamsRequestHandler.rejected]: (state, action) => {
      state.isSavedTeamsStateLoading = false;
      if (action.payload.responseStatus === 401) {
        state.savedTeamSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.savedTeamsState = { error: action.payload };
      }
    },

    //--------------------------------------------------------------------------------------------------------------------------

    [saveTeamRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [saveTeamRequestHandler.fulfilled]: (state, action) => {
      //  we do not need to update "savedTeamsState" state as this crud operation is conducted ON COMPLETELY DIFFERENT PAGES than where the "savedTeamsState" is shown
      state.isCRUDLoading = false;
      state.CRUDResultState = { data: 'success' }; // need to set this "CRUDResultState" state when "data", which will be later be used as CRUD SUCCESS conditional indicator
      state.savedTeamCountState = action.payload;
      localStorage.setItem('savedTeamCountLocalState', JSON.stringify(action.payload)); // also update in local storage for data preservation
    },
    [saveTeamRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;
      if (action.payload.responseStatus === 401) {
        state.savedTeamSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.CRUDResultState = { error: action.payload };
      }
    },

    //--------------------------------------------------------------------------------------------------------------------------

    [deleteOneSavedTeamsRequestHandler.pending]: (state, action) => {
      state.isCRUDLoading = true;
    },
    [deleteOneSavedTeamsRequestHandler.fulfilled]: (state, action) => {
      // no need to set "CRUDResultState" when "data", since we do not need any success CRUDResultState as conditional indicator
      state.isCRUDLoading = false;
      state.savedTeamsState = { data: action.payload };
      state.savedTeamCountState = action.payload.savedTeamsCount;
      localStorage.setItem('savedTeamCountLocalState', JSON.stringify(action.payload.savedTeamsCount)); // also update in local storage for data preservation
    },
    [deleteOneSavedTeamsRequestHandler.rejected]: (state, action) => {
      state.isCRUDLoading = false;
      if (action.payload.responseStatus === 401) {
        state.savedTeamSliceJwtVerificationState = { error: action.payload };
      }
      if (action.payload.responseStatus !== 401) {
        state.CRUDResultState = { error: action.payload };
      }
    },
  },
});

const savedTeamSliceSyncActions = savedTeamSlice.actions;

export default savedTeamSlice;
export { savedTeamSliceSyncActions, getSavedTeamsRequestHandler, saveTeamRequestHandler, deleteOneSavedTeamsRequestHandler };
