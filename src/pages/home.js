import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';
import '../style/main-content.css';


// Import components
import Carousel from '../components/carousel';
import NineCard from '../components/ninecard';
import FacebookDiscord from '../components/facebook-discord';
import Banner from '../components/banner';

import Heading from '../resources/banner, etc/heading-home.png'

import { getJSON } from '../helper/api';



function Home() {

  const [carouselSelect, setCarouselSelect] = useState([]);
  const [sortedNineListHome, setSortedNineListHome] = useState([]);

  const navigate = useNavigate();

   useEffect(() => {
    window.scrollTo(0, 0);

    getJSON('/Home/carousel')
      .then(setCarouselSelect)
      .catch(err => console.error('Error fetching carouselSelect:', err));

    getJSON('/Home/sorted-nine-list')
      .then(setSortedNineListHome)
      .catch(err => console.error('Error fetching sortedNineListHome:', err));
  }, []);

  return (

    <div className="App gradient-background">


      <Banner />

      <div id="main-content-container">

        <div id="main-content-wrapper">



          <Carousel items={carouselSelect} />

          {/* <div id="title-news-project">
            <p className="title-style title-color semibold">Dự án mới ra mắt</p>
          </div> */}

          <div className="project-wrapper">

            {/* <div className="project-content">
              <div className="grid-container">
                {sortedProjectItems.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div> */}

            <div id="title-news-project">
              <LazyLoadImage
                className="card-img-top"
                src={Heading}
                alt="Các bài đăng mới"
                effect="blur"
                placeholderSrc=""
              />
            </div>

            <div id="second-main-wrapper">
              <div id="post-main-wrapper">
                <div id="grid-post-wrapper">
                  {sortedNineListHome.map((post) => (
                    <NineCard key={post.id} post={post} />
                  ))}
                </div>

                <button class="button" onClick={() => navigate('/project')}>
                  Xem thêm
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>

              </div>

              <div id="side-bar-wrapper">
                <FacebookDiscord />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
