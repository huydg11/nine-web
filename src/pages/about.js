import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import NineLogo from '../resources/logo/nine-logo-original.png';
import AboutHead1 from '../resources/banner, etc/list, about us heading/about-heading-1.png'
import AboutHead2 from '../resources/banner, etc/list, about us heading/about-heading-2.png'
import AboutHead3 from '../resources/banner, etc/list, about us heading/about-heading-3.png'
import AboutHead4 from '../resources/banner, etc/list, about us heading/about-heading-4.png'


import Banner from '../components/banner';

function AboutUs() {

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



                <div className='heading-about-wrapper' style={{maxWidth:'40rem'}} >
                  <LazyLoadImage
                    className="card-img-top"
                    src={AboutHead1}
                    alt="Các bài đăng mới"
                    effect="blur"
                    placeholderSrc=""
                  />
                </div>

              </div>

              <div className='about-first' style={{ display: 'flex'}}>

                <div className='paragraph-content'>


                  Nine Translation là một nhóm dịch với phương châm "thích gì dịch nấy". Chúng mình chuyên dịch nhiều thể loại như Manga, Anime, Light Novel và đặc biệt là Visual Novel.

                  Dù mới được thành lập với đội ngũ thành viên còn non trẻ, Nine Translation đã nhận được sự hỗ trợ từ các đàn anh đi trước, đặc biệt là nhóm Hoshi – nơi chúng mình tách ra để phát triển. Chỉ sau một năm cải thiện cách tổ chức, làm việc và quản lý dự án, nhóm đã dần khẳng định được vị thế của mình trong cộng đồng và tiếp tục thực hiện các dự án Việt hóa.

                </div>

                <div>

                  <LazyLoadImage
                    className="card-img-top"
                    src={NineLogo}
                    alt="Các bài đăng mới"
                    effect="blur"
                    placeholderSrc=""
                  />


                </div>



              </div>


              <div className='heading-about-wrapper' style={{maxWidth:'51rem'}}>
                  <LazyLoadImage
                    className="card-img-top"
                    src={AboutHead2}
                    alt="Các bài đăng mới"
                    effect="blur"
                    placeholderSrc=""
                  />
                </div>

                <div className='heading-about-wrapper' style={{maxWidth:'45rem'}}>
                  <LazyLoadImage
                    className="card-img-top"
                    src={AboutHead3}
                    alt="Các bài đăng mới"
                    effect="blur"
                    placeholderSrc=""
                  />
                </div>

                <div className='heading-about-wrapper' style={{maxWidth:'26rem'}}>
                  <LazyLoadImage
                    className="card-img-top"
                    src={AboutHead4}
                    alt="Các bài đăng mới"
                    effect="blur"
                    placeholderSrc=""
                  />
                </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutUs;
