import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import '../style/home.css';
import '../style/main-content.css';
import '../style/post.css';
import Banner from '../components/banner';
import FacebookDiscord from '../components/facebook-discord';
import RecommendPost from '../components/recommend';
import NineRender from './project/nine/@nine-project-render';
import Error from '../components/error';
import HeadingRecommend from "../resources/banner, etc/list, about us heading/heading-recommend.png";
import { getJSON } from '../helper/api';
import DisqusThread from '../components/disqus';

function ProjectDetail() {
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [randomThree, setRandomThree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const segments = location.pathname.split('/');
    const finder = segments[segments.length - 1];

    async function fetchDetail() {
      try {
        const data = await getJSON(`/Project/${finder}`);
        setProject(data);
      } catch (err) {
        console.error('Error loading detail:', err);
        setProject(null);
      }
    }

    async function fetchRandom() {
      try {
        const data = await getJSON('/Home/random-three');
        setRandomThree(data);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setRandomThree([]);
      }
    }

    Promise.all([fetchDetail(), fetchRandom()])
      .finally(() => setLoading(false));
  }, [location.pathname]);

  if (loading) {
    return <div className="App">Loading…</div>;
  }

  if (!project) {
    return <Error />;
  }

  const disqusShortname = 'ninetranslation';
  const disqusUrl = window.location.href;
  const disqusId = project.finder;
  const disqusTitle = project.heading;

  

  const isPost = project.type === 'post';
  const crumbRoot = isPost ? '/post' : '/project';
  const crumbLabel = isPost ? 'Post' : 'Project';

  return (
    <div className="App gradient-background">
      <Banner />

      <div id="main-content-container">
        <div id="sub-content-container">
          <div id="second-main-wrapper">
            <div id="project-detail-wrapper">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to={crumbRoot}>{crumbLabel}</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{project.heading}</li>
                </ol>
              </nav>

              <NineRender project={project} />

              <DisqusThread
                shortname={disqusShortname}
                identifier={disqusId}
                title={disqusTitle}
                url={disqusUrl}
              />

            </div>

            <div id="side-bar-wrapper">
              <div id="recommend-container">
                <div id="sidebar-recommend-heading-wrapper">
                  <LazyLoadImage
                    src={HeadingRecommend}
                    alt="Bạn có thể thích"
                    effect="blur"
                    placeholderSrc=""
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="recommend-post-wrapper">
                  {randomThree.map(post => (
                    <RecommendPost key={post.id} post={post} />
                  ))}
                </div>
              </div>

              <FacebookDiscord />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
