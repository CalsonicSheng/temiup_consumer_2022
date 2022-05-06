import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { authSliceSyncActions } from '../../data/slices/authSlice';
import customClasses from './customStyle.module.css';

export default function Header() {
  const { pathname } = useLocation();

  const { authState } = useSelector((state) => {
    return state.authReducer;
  });

  const { usernameState } = useSelector((state) => {
    return state.userReducer;
  });

  const { savedTeamCountState } = useSelector((state) => {
    return state.savedTeamReducer;
  });

  const dispatch = useDispatch();

  //--------------------------------------------------------------------------------------

  function LogoutHandler() {
    dispatch(authSliceSyncActions.authResetOrLogoutHandler());
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        {/* Ttile ----------------------------------------------------------------------------------------------------------------------- */}

        <Link className="navbar-brand" to="/all-teams">
          <h2 className="m-0 fw-bold">Temiup</h2>
        </Link>

        {/* collapse button (when width is shrinked) ------------------------------------------------------------------------------------- */}

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* nav-items --------------------------------------------------------------------------------------------------------------------- */}

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ms-auto">
            {/* saved Team nav link------------------------------------------------------------------------------------------------------------- */}

            <li className="nav-item">
              <Link className="nav-link me-4" to="/saved-teams">
                <div className={`${customClasses[`saved-team-nav`]}`}>
                  <i className="fa-solid fa-users me-2"></i>
                  <span>Saved Team</span>
                  {savedTeamCountState === 0 ? (
                    <></>
                  ) : (
                    <div className={`${customClasses['saved-team-count']} bg-danger text-white text-center`}>
                      <span className="fw-bold px-2 py-2 m-0">{savedTeamCountState}</span>
                    </div>
                  )}
                </div>
              </Link>
            </li>

            {/* sign in or dropdown (after signin) nav link ------------------------------------------------------------------------------------------*/}

            {authState.data ? (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className={`me-2 fa-solid fa-user`}></i>
                  <span>{usernameState}</span>
                </button>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to="/profile">
                    <span>Profile</span>
                  </Link>
                  <Link className="dropdown-item" to="/all-teams" onClick={LogoutHandler}>
                    <span>Logout</span>
                  </Link>
                </div>
              </li>
            ) : pathname === '/auth/signin' || pathname === '/auth/signup' ? (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/auth/signin"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <i className="fa-solid fa-user me-2"></i>
                  <span>Sign In</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/auth/signin" state={pathname}>
                  <i className="fa-solid fa-user me-2"></i>
                  <span>Sign In</span>
                </Link>
              </li>
            )}
          </ul>
          {/* <form className="d-flex">
            <input className="form-control me-sm-2" type="text" placeholder="Search" />
            <button className="btn btn-secondary my-2 my-sm-0" type="submit">
              Search
            </button>
          </form> */}
        </div>
      </div>
    </nav>
  );
}
