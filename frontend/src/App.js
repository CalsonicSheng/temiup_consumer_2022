import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import SignInScreen from './screens/auth_screens/SignInScreen';
import SignUpScreen from './screens/auth_screens/SignUpScreen';
import HomeScreen from './screens/home_screen/HomeScreen';
import SelectedTeamScreen from './screens/selected_team_screen/SelectedTeamScreen';
import { Provider } from 'react-redux';
import temiupStore from './data/store';
import SavedTeamsScreen from './screens/saved_teams_screen/SavedTeamsScreen';
import HomeAllTeamsScreen from './screens/home_screen/HomeAllTeamsScreen';
import HomeAlmostCompleteTeamsScreen from './screens/home_screen/HomeAlmostCompleteTeamsScreen';
import HomeNewTeamsScreen from './screens/home_screen/HomeNewTeamsScreen';
import ProfileScreen from './screens/profile_screen/ProfileScreen';
import ProfileAddressesScreen from './screens/profile_screen/ProfileAddressesScreen';
import CheckoutInformationScreen from './screens/checkout_screen/CheckoutInformationScreen';
import CheckoutConfirmationScreen from './screens/checkout_screen/CheckoutConfirmationScreen';
import OrderScreenSuccessScreen from './screens/order_result_screen/OrderScreenSuccessScreen';
import OrderScreenErrorScreen from './screens/order_result_screen/OrderScreenErrorScreen';

function App() {
  return (
    <Provider store={temiupStore}>
      <main className="main-content-section">
        <BrowserRouter>
          <Header />
          {/* -------------- main contents starts from here -------------- */}
          <div className="container my-5">
            <Routes>
              <Route path="/" element={<HomeScreen />}>
                <Route path="all-teams" element={<HomeAllTeamsScreen />} />
                <Route path="almost-complete-teams" element={<HomeAlmostCompleteTeamsScreen />} />
                <Route path="new-teams" element={<HomeNewTeamsScreen />} />
              </Route>
              <Route path="/auth/signin" element={<SignInScreen />} />
              <Route path="/auth/signup" element={<SignUpScreen />} />
              <Route path="/selected-team/:selectedTeamId" element={<SelectedTeamScreen />} />
              <Route path="/saved-teams" element={<SavedTeamsScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/addresses" element={<ProfileAddressesScreen />} />
              <Route path="/checkout-information/:selectedTeamId" element={<CheckoutInformationScreen />} />
              <Route path="/checkout-confirmation/:selectedTeamId" element={<CheckoutConfirmationScreen />} />
              <Route path="/order/success" element={<OrderScreenSuccessScreen />} />
              <Route path="/order/error" element={<OrderScreenErrorScreen />} />
            </Routes>
          </div>
          {/* -------------- main contents ends from here -------------- */}
        </BrowserRouter>
      </main>
    </Provider>
  );
}

export default App;
