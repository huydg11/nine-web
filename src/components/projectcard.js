import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  return (
    <div className="card">
      <a className="img-wrapper" href={project.link}>
      <motion.div  whileHover={{ scale: 1.1, filter: "brightness(1.1)"}}  transition={{ duration: 0.3 }}>
          <LazyLoadImage
            className="card-img-top"
            src={project.thumbnail}
            alt={project.heading}
            effect="blur"
            placeholderSrc=""
          />
        </motion.div>
      </a>
      <div className="card-body">
        <a href= {project.link} className="card-title" style={{ fontSize: '2rem' }}>{project.heading}</a>
        <span className="post-tags" style={{ fontSize: '1.5rem' }}>
          <em>By</em> <a>{project.by}</a>
        </span>
        <p className="card-text trucation" style={{ fontSize: '1.3rem' }}>{project.content}.</p>
        <p className="card-text" style={{ fontSize: '1.5rem' }}><small className="text-muted">{project.date}</small></p>
      </div>
    </div>
  );
};

export default ProjectCard;