import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';


const RecommendPost = ({ post }) => {
  return (



      <div id="recommend-card" className="card mb-3 mx-auto" style={{ width: '100%', overflow: 'hidden' }}>
        <div className="row g-0 flex-column flex-sm-row" style={{ height: '100%' }}>
          <div className="col-12 col-sm-6 d-flex align-items-stretch" style={{ overflow: 'hidden' }}>
            <a className="img-wrapper" href={post.link} style={{ display: 'flex', width: '100%', height: '100%', aspectRatio: '16/9' }}>
              <motion.div whileHover={{ scale: 1.1, filter: "brightness(1.1)" }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%' }}>
                <LazyLoadImage
                  src={post.thumbnail}
                  alt={post.heading}
                  effect="blur"
                  placeholderSrc=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>
            </a>
          </div>
          <div className="col-12 col-sm-6">
            <div className="card-body d-flex flex-column justify-content-between" style={{ height: '100%' }}>
              <a href={post.link} className="recommend-card-heading card-title trucation-sidebar-2">{post.heading}</a>
              <p className="card-text trucation-sidebar-1" style={{ margin: 0, }}><small className="recommend-card-date text-muted">{post.date}</small></p>
            </div>
          </div>
        </div>
      </div>



    // // <div id="recommend-card">
    // //     <div className="post">
    // //         <div className="post-content" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', height: '150px' }}>
    // //             <a className="img-wrapper" href={post.link} style={{ height: '100%' }}>
    // //                 <motion.div whileHover={{ scale: 1.1, filter: "brightness(1.1)" }} transition={{ duration: 0.3 }} style={{ height: '100%' }}>
    // //                     <LazyLoadImage
    // //                         src={post.thumbnail}
    // //                         alt={post.heading}
    // //                         effect="blur"
    // //                         placeholderSrc=""
    // //                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    // //                     />
    // //                 </motion.div>
    // //             </a>

    // //             <div className="post-info" style={{ height: '100%', paddingLeft: '16px' }}>
    // //                 <a href={post.link} className="card-title" style={{ marginBottom: '8px' }}>
    // //                     {post.heading}
    // //                 </a>
    // //                 <p className="card-text" style={{ margin: 0, }}>
    // //                     <small className="text-muted">{post.date}</small>
    // //                 </p>
    // //             </div>
    // //         </div>


    //     </div>

    // </div>



  );
};

export default RecommendPost;
