import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';

const NineCard = ({ post }) => {
  const authorLabel = post.type === 'post' ? 'Author' : 'By';
  let authorColor = "#013b57";

  if (post.by === 'Gero Saga') {
    authorColor = "#013b57";
  } else if (post.by === 'Nine Translation') {
    authorColor = "#00A0CF";
  }

  

  return (
    <div className="col">
      <div className="card-post card">
        <a className="img-wrapper" href={post.link} style={{ aspectRatio: '16 /9'}}>
          <motion.div whileHover={{ scale: 1.1, filter: "brightness(1.1)" }} transition={{ duration: 0.3 }} >
            <LazyLoadImage
              className="card-img-top"
              src={post.thumbnail}
              alt={post.heading}
              effect="blur"
              placeholderSrc=""
            />
          </motion.div>
        </a>
        <div className="card-body">
          <a href={post.link} className="card-title trucation-2" style={{ fontSize: '2rem' }}>{post.heading}</a>
          <span className="post-tags" style={{ fontSize: '1.5rem' }}>
            <em>{authorLabel}</em> <a style={{color: authorColor}}>{post.by}</a>
          </span>
          <p className="card-text trucation" style={{ fontSize: '1.3rem' }}>{post.shortDescription}</p>
          <p className="card-text"><small className="text-muted" style={{ fontSize: '1.2rem' }}>{post.date}</small></p>
        </div>
      </div>
    </div>
  );
};

export default NineCard;
