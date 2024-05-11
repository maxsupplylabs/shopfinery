'use client'
import React, { useState } from 'react';

export default function AboutCollection({ data }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Function to toggle the show/hide state
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Limit the description to 8 words on mobile and 20 words on desktop
  const limitedDescription = data.description
    .split(' ')
    .slice(0, window.innerWidth <= 768 ? 8 : 20)
    .join(' ');

  return (
    <div>
      {showFullDescription ? (
        <div>
          <p>{data.description}</p>
          <button className='text-blue-600' onClick={toggleDescription}>Hide</button>
        </div>
      ) : (
        <div>
          {limitedDescription}{' '}
          {data.description.split(' ').length > (window.innerWidth <= 768 ? 8 : 20) && (
              <button className='text-blue-600 underline underline-offset-4' onClick={toggleDescription}>Show more</button>
              )}
        </div>
      )}
    </div>
  );
}
