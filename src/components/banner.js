import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import NineBanner from '../resources/banner, etc/Web banner.webp';
import PlaceHolder from '../resources/banner, etc/Web banner dump.webp'

const Banner = () => {
  return (
    <div id="the-container">
      <div className='banner-container'>
        <div className='banner-image-wrapper'>
          <LazyLoadImage
            className="banner-image"
            src={NineBanner}
            alt="Nine Banner"
            effect="blur"
            placeholderSrc={PlaceHolder}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
