import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getAllTeamsRequestHandler = createAsyncThunk('teamSlice/getAllTeamsRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getAllTeamsRequestHandler run');
  try {
    const response = await axios.get(`/team/all-teams/?selectedCategory=${axiosParameter.lowerCasedCategory}&selectedPage=${axiosParameter.selectedPageStateDecrement}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

const getAlmostCompleteTeamsRequestHandler = createAsyncThunk('teamSlice/getAlmostCompleteTeamsRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getAlmostCompleteTeamsRequestHandler run');
  try {
    const response = await axios.get(`/team/almost-complete-teams/?selectedCategory=${axiosParameter.lowerCasedCategory}&selectedPage=${axiosParameter.selectedPageStateDecrement}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

const getNewTeamsRequestHandler = createAsyncThunk('teamSlice/getNewTeamsRequestHandler', async function (axiosParameter, { rejectWithValue }) {
  console.log('getNewTeamsRequestHandler run');
  try {
    const response = await axios.get(`/team/new-teams/?selectedCategory=${axiosParameter.lowerCasedCategory}&selectedPage=${axiosParameter.selectedPageStateDecrement}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//-----------------------------------------------------------------------------------------------------------------------------------------------

const getSelectedTeamRequestHandler = createAsyncThunk('teamSlice/getSelectedTeamRequestHandler', async function (selectedTeamId, { rejectWithValue }) {
  console.log('getSelectedTeamRequestHandler run');
  try {
    const response = await axios.get(`/team/${selectedTeamId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const teamSliceInitialState = {
  isHomeTeamsStateLoading: false,
  isSelectedTeamStateLoading: false,
  homeTeamsState: {},
  selectedTeamState: {},
};

const teamSlice = createSlice({
  name: 'teamSlice',
  initialState: teamSliceInitialState,
  extraReducers: {
    [getAllTeamsRequestHandler.pending]: (state, action) => {
      state.isHomeTeamsStateLoading = true;
    },
    [getAllTeamsRequestHandler.fulfilled]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { data: action.payload };
    },
    [getAllTeamsRequestHandler.rejected]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { error: action.payload };
    },

    //--------------------------------------------------------------------------------------

    [getAlmostCompleteTeamsRequestHandler.pending]: (state, action) => {
      state.isHomeTeamsStateLoading = true;
    },
    [getAlmostCompleteTeamsRequestHandler.fulfilled]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { data: action.payload };
    },
    [getAlmostCompleteTeamsRequestHandler.rejected]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { error: action.payload };
    },

    //--------------------------------------------------------------------------------------

    [getNewTeamsRequestHandler.pending]: (state, action) => {
      state.isHomeTeamsStateLoading = true;
    },
    [getNewTeamsRequestHandler.fulfilled]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { data: action.payload };
    },
    [getNewTeamsRequestHandler.rejected]: (state, action) => {
      state.isHomeTeamsStateLoading = false;
      state.homeTeamsState = { error: action.payload };
    },

    //---------------------------------------------------------------------------------------

    [getSelectedTeamRequestHandler.pending]: (state, action) => {
      state.isSelectedTeamStateLoading = true;
    },
    [getSelectedTeamRequestHandler.fulfilled]: (state, action) => {
      state.isSelectedTeamStateLoading = false;
      state.selectedTeamState = { data: action.payload };
    },
    [getSelectedTeamRequestHandler.rejected]: (state, action) => {
      state.isSelectedTeamStateLoading = false;
      state.selectedTeamState = { error: action.payload };
    },
  },
});

export default teamSlice;
export { getAllTeamsRequestHandler, getAlmostCompleteTeamsRequestHandler, getNewTeamsRequestHandler, getSelectedTeamRequestHandler };
