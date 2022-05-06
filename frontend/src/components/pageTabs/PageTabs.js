import React from 'react';
import customClasses from './customStyle.module.css';

export default function PageTabs({ totalPageCount, selectedPage, setSelectedPageHandler }) {
  function goToPreviousPageHandler() {
    setSelectedPageHandler(Math.max(1, selectedPage - 1));
  }

  function goToNextPageHandler() {
    setSelectedPageHandler(Math.min(totalPageCount, selectedPage + 1));
  }

  function pageSelectionHandler(page) {
    setSelectedPageHandler(page);
  }

  // conditionally and dynamically setting the total page with left and right bound
  function pageValueGeneratorHandler() {
    const pageValueList = [];
    const pageRangeCount = 5;
    const leftBoundPage = selectedPage - 2;
    const rightBoundPage = selectedPage + 2;

    if (leftBoundPage <= 1 && rightBoundPage <= totalPageCount) {
      for (let i = 1; i <= pageRangeCount; i++) {
        pageValueList.push(i);
      }
    }

    if (leftBoundPage <= 1 && rightBoundPage > totalPageCount) {
      for (let i = 1; i <= totalPageCount; i++) {
        pageValueList.push(i);
      }
    }

    if (leftBoundPage > 1 && rightBoundPage <= totalPageCount) {
      for (let i = leftBoundPage; i <= rightBoundPage; i++) {
        pageValueList.push(i);
      }
    }

    if (leftBoundPage > 1 && rightBoundPage > totalPageCount) {
      for (let i = totalPageCount - pageRangeCount + 1; i <= totalPageCount; i++) {
        pageValueList.push(i);
      }
    }

    return pageValueList;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {totalPageCount === 1 ? (
        <></>
      ) : (
        <div className="d-flex justify-content-center align-items-center mt-5">
          <i className={`fa-solid fa-chevron-left me-4 ${customClasses['chevron-custom']} px-3 py-2`} onClick={goToPreviousPageHandler} />
          {pageValueGeneratorHandler().map((e) => {
            return (
              <div
                className={`px-3 py-2 mx-3 ${e === selectedPage ? customClasses['page-tab-selected-custom'] : customClasses['page-tab-unselect-custom']} `}
                key={e}
                onClick={() => {
                  pageSelectionHandler(e);
                }}
              >
                <h5 className="m-0 p-0">{e}</h5>
              </div>
            );
          })}
          <i className={`fa-solid fa-chevron-right ms-4 ${customClasses['chevron-custom']} px-3 py-2`} onClick={goToNextPageHandler} />
        </div>
      )}
    </>
  );
}
