import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import NoImage from '../resources/banner, etc/no results found.png';

const NoResult = () => {
  return (
    <div className='result-container'>
        <div className='result-image-wrapper'>
      <LazyLoadImage
        className="result-image"
        src={NoImage}
        alt="Nine Banner"
        effect="blur"
        placeholderSrc=""
      />
      </div>
    </div>
  );
};

export default NoResult;
