import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeTeamCard from '../../components/home_team_card/HomeTeamCard';
import LoadingSpinner from '../../components/loading_spinner/LoadingSpinner';
import ErrorMessageBox from '../../components/message_box/ErrorMessageBox';
import LoadingMessageBox from '../../components/message_box/LoadingMessageBox';
import PageTabs from '../../components/pageTabs/PageTabs';
import WarningMessageBox from '../../components/message_box/WarningMessageBox';
import { getAllTeamsRequestHandler } from '../../data/slices/teamSlice';

export default function HomeAllTeamsScreen() {
  const { isHomeTeamsStateLoading, homeTeamsState } = useSelector((state) => {
    return state.teamReducer;
  });

  const { selectedCategory } = useSelector((state) => {
    return state.homeCategoryReducer;
  });

  const [selectedPageState, setSelectedPageState] = useState(1);

  const dispatch = useDispatch();

  //-----------------------------------------------------------------------------------------------------------------

  function setSelectedPageStateHandler(selectedPageState) {
    setSelectedPageState(selectedPageState);
  }

  useEffect(() => {
    // need to change category name to all lower case for backend
    const lowerCasedCategory = selectedCategory[0].toLowerCase() + selectedCategory.slice(1);
    // need to decrement the selectedPageState by 1 before sending to backend | page count starts from 0 in backend controller logic while frontend starts at 1
    const selectedPageStateDecrement = selectedPageState - 1;
    dispatch(getAllTeamsRequestHandler({ lowerCasedCategory, selectedPageStateDecrement }));
  }, [dispatch, selectedCategory, selectedPageState]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isHomeTeamsStateLoading ? (
        <LoadingMessageBox>
          <h5 className="m-0 p-0 me-2">Loading</h5>
          <LoadingSpinner heightValue={'20px'} widthValue={'20px'} />
        </LoadingMessageBox>
      ) : homeTeamsState.data && homeTeamsState.data.totalPageCount === 0 ? (
        <WarningMessageBox>
          <h5 className="m-0 p-0 text-danger">No teams found yet</h5>
        </WarningMessageBox>
      ) : homeTeamsState.data && homeTeamsState.data.totalPageCount !== 0 ? (
        <>
          <div className="row gx-5 gy-5">
            {homeTeamsState.data.fetchedTeamList.map((e) => {
              return (
                <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-stretch" key={e._id}>
                  <HomeTeamCard teamInfo={e} />
                </div>
              );
            })}
          </div>
          <PageTabs totalPageCount={homeTeamsState.data.totalPageCount} selectedPageState={selectedPageState} setSelectedPageStateHandler={setSelectedPageStateHandler} />
        </>
      ) : homeTeamsState.error && homeTeamsState.error.customizedMessage ? (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">{homeTeamsState.error.customizedMessage}</h5>
        </ErrorMessageBox>
      ) : (
        <ErrorMessageBox>
          <h5 className="m-0 p-0">Something went wrong from our side</h5>
        </ErrorMessageBox>
      )}
    </>
  );
}
