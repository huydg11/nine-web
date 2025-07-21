import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Banner from '../components/banner';

function Donate() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="App gradient-background">


      <Banner />

      <div id="main-content-container">

        <div id="main-content-wrapper">

          <div id="about-page-container">

            <div id="about-page-wrapper">

              <div className='paragraph-wrapper'>


              </div>

            </div>

          </div>

        </div>

      </div>
      
    </div>
  );
}

export default Donate;