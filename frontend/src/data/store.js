import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/teamSlice';
import authSlice from './slices/authSlice';
import savedTeamSlice from './slices/savedTeamSlice';
import homeCategorySlice from './slices/homeCategorySlice';
import userSlice from './slices/userSlice';
import orderSlice from './slices/orderSlice';
import addressSlice from './slices/addressSlice';

const temiupStore = configureStore({
  reducer: {
    homeCategoryReducer: homeCategorySlice.reducer,
    teamReducer: teamSlice.reducer,
    savedTeamReducer: savedTeamSlice.reducer,
    authReducer: authSlice.reducer,
    userReducer: userSlice.reducer,
    orderReducer: orderSlice.reducer,
    addressReducer: addressSlice.reducer,
  },
});

export default temiupStore;
