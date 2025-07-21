import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Error404 from '../resources/banner, etc/404 web image.png';

const Error = () => {
  return (
    <div className='result-container'>
        <div className='result-image-wrapper'>
      <LazyLoadImage
        className="result-image"
        src={Error404}
        alt="Nine Banner"
        effect="blur"
        placeholderSrc=""
      />
      </div>
    </div>
  );
};

export default Error;
