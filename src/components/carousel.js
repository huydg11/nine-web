import React, { useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const Carousel = ({ items }) => {
  const carouselRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (carouselRef.current) {
        carouselRef.current.carousel('next');
      }
    },
    onSwipedRight: () => {
      if (carouselRef.current) {
        carouselRef.current.carousel('prev');
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div id="carousel-wrapper" {...handlers}>
      <div
        id="carouselIndicators"
        className="carousel slide"
        data-ride="carousel"
        ref={carouselRef}
      >
        <ol className="carousel-indicators" id="carousel-indicators">
          {items.map((item, index) => (
            <li
              key={item.id}
              data-target="#carouselIndicators"
              data-slide-to={index}
              className={index === 0 ? 'active' : ''}
            ></li>
          ))}
        </ol>
        <div className="carousel-inner" id="carousel-inner">
          {items.map((item, index) => (
            <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <a href={item.link}>
                <motion.div whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }} transition={{ duration: 0.3 }}>
                  <LazyLoadImage
                    className="d-block w-100"
                    src={item.thumbnail}
                    alt={item.heading}
                    effect="blur"
                    placeholderSrc=""
                    style={{aspectRatio: '16/9'}}
                  />
                </motion.div>
                <div className="carousel-caption d-md-block">
                  <h1>{item.heading}</h1>
                  <p>Nine Translation Project</p>
                  <p>{item.date}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
        <a className="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
};

export default Carousel;
