import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getCategoryListRequestHandler, homeCategorySliceSyncActions } from '../../data/slices/homeCategorySlice';
import customClasses from './customStyle.module.css';

export default function HomeScreen() {
  const [tabValue, setTabValue] = useState('all teams');

  const { categoryList, selectedCategory } = useSelector((state) => {
    return state.homeCategoryReducer;
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  //------------------------------------------------------------------------------------------------------------------

  function tabValueSwitchHandler(selectedTabValue) {
    // reset the selected category back to "all" before switching to different tab
    dispatch(homeCategorySliceSyncActions.selectedCategoryResetHandler());
    // set to new tab value
    setTabValue(selectedTabValue);
  }

  function getCategoryInputHandler(e) {
    dispatch(homeCategorySliceSyncActions.categorySelectHandler(e.target.value));
  }

  useEffect(() => {
    dispatch(getCategoryListRequestHandler());
  }, [dispatch]);

  // when user reach to "home", always auto navigate to "all-teams" sub route
  useEffect(() => {
    navigate('/all-teams');
  }, []);

  function categoryOptionGeneratorHandler() {
    if (categoryList.data) {
      const categoryOptionList = categoryList.data.map((e) => {
        return (
          <option value={e} key={e}>
            {e}
          </option>
        );
      });
      return categoryOptionList;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <Link
          to="all-teams"
          className={`${tabValue === 'all teams' && customClasses['tab-custom']} mx-4 px-2 pb-2 link-custom`}
          onClick={() => {
            tabValueSwitchHandler('all teams');
          }}
        >
          <h4 className="m-0 p-0">All Teams</h4>
        </Link>
        <Link
          to="almost-complete-teams"
          className={`${tabValue === 'almost complete' && customClasses['tab-custom']} mx-4 px-2 pb-2 link-custom`}
          onClick={() => {
            tabValueSwitchHandler('almost complete');
          }}
        >
          <h4 className="m-0 p-0">Almost Complete</h4>
        </Link>
        <Link
          to="new-teams"
          className={`${tabValue === 'new teams' && customClasses['tab-custom']} mx-4 px-2 pb-2 link-custom`}
          onClick={() => {
            tabValueSwitchHandler('new teams');
          }}
        >
          <h4 className="m-0 p-0">New Teams</h4>
        </Link>
      </div>
      <select className={`form-select bg-light text-dark radius-custom py-2 px-2 mb-5 ${customClasses['select-custom']}`} onChange={getCategoryInputHandler} value={selectedCategory}>
        {categoryOptionGeneratorHandler()}
      </select>
      <Outlet />
    </>
  );
}
