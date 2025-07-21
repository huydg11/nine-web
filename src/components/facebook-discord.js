import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import HeadingFacebook from '../resources/banner, etc/list, about us heading/heading-facebook.png'
import HeadingDiscord from '../resources/banner, etc/list, about us heading/heading-discord.png'
import HeadingPartner from '../resources/banner, etc/list, about us heading/heading-partner.png'
import StaffHiring from '../resources/banner, etc/staff-invite.png'
import VNKFC from '../resources/logo/VNKFC_Logo.png'
import Gero from '../resources/logo/GeroSagaFavicon2_1.png'


const FacebookDiscord = () => {
    return (
        <div id="facebook-discord-wrapper">

            <div id="facebook-container">
                <div id="sidebar-recommend-heading-wrapper">
                    <LazyLoadImage
                        src={HeadingFacebook}
                        alt="Trang chủ Facebook"
                        effect="blur"
                        placeholderSrc=""
                        style={{ width: '100%' }}
                    />
                </div>

                <div id="facebook-page-wrapper">
                    {/* Facebook Iframe */}
                    <iframe
                        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fninetranslation&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                        width="340"
                        height="130"
                        style={{ border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen="true"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                </div>

            </div>


            <div id="discord-container">
                <div id="sidebar-recommend-heading-wrapper">
                    <LazyLoadImage
                        src={HeadingDiscord}
                        alt="Cộng đồng Discord"
                        effect="blur"
                        placeholderSrc=""
                        style={{ width: '100%' }}
                    />
                </div>

                <div id="discord-wrapper">
                    {/* Discord Iframe */}
                    <iframe
                        src="https://discord.com/widget?id=1028334739775553607&theme=dark"
                        width="350"
                        height="500"
                        allowtransparency="true"
                        frameBorder="0"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    ></iframe>
                </div>

            </div>


            <div id="partner-container">
                <div id="sidebar-recommend-heading-wrapper">
                    <LazyLoadImage
                        src={HeadingPartner}
                        alt="Cộng đồng khác"
                        effect="blur"
                        placeholderSrc=""
                        style={{ width: '100%' }}
                    />
                </div>

                <div id="sidebar-partner-rec-wrapper">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKw5oBi8VeMNz_OAWxRssj9-DR_n5AwhmeyXU3bejyg2lEKCp16Co1Mj0isE7rbGOTuGt_LITaIn-zDW87G7OoXyajAhAlqL3s0mppDDyiv0n0jmjxTQOz0VX-gK-gC_yz230D8Nh5Iw6t_i2ASPn0u8NMOUJtFfye-Vo_AX-dA4lAFCL3gCsQ5o994xmK/s300/Logo%20(Small).png" alt="Hoshi Visual Novel" width="40" height="30" />
                            <a href="http://www.hoshivsub.com/" target="_blank">
                                Hoshi Visual Novel
                            </a>
                        </li>
                        <li class="list-group-item">
                            <img src={VNKFC} alt="Hoshi Visual Novel" width="40" />
                            <a href="https://vnkeyfc.com/" target="_blank">
                                Vietnam Key Fanclub
                            </a>
                        </li>
                        <li class="list-group-item">
                            <img src={Gero} alt="Hoshi Visual Novel" width="40" />
                            <a href="https://gerosaga.com/" target="_blank">
                                Gero Saga Team
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            <div id="sidebar-staff-hire-wrapper">
                <a href=''>
                    <LazyLoadImage
                        src={StaffHiring}
                        alt="Tuyển nhân sự"
                        effect="blur"
                        placeholderSrc=""
                        style={{ width: '100%' }}
                    />
                </a>
            </div>

        </div>
    );
};

export default FacebookDiscord;