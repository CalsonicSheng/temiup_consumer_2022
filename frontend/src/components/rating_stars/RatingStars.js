import React from 'react';

export default function RatingStars({ rating }) {
  const ratingScale = [
    [0.5, 1],
    [1.5, 2],
    [2.5, 3],
    [3.5, 4],
    [4.5, 5],
  ];
  return (
    <>
      {ratingScale.map((e) => {
        return (
          // if rating is 3.5: 3.5 > 1, 2, and 3 so it gets 3 stars | but less than 4, but greater than 3.5, get half star | and then smaller than all rest of scale gets empty star afterwards
          <span key={e[0]}>
            <i className={`${rating >= e[1] ? 'fas fa-star' : rating >= e[0] ? 'fas fa-star-half-alt' : 'far fa-star'} text-warning`}></i>
          </span>
        );
      })}
    </>
  );
}
