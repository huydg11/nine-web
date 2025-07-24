import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NineLogo from '../../resources/logo/nine-logo-white.png';

import '../../style/admin.css';

import { getJSON } from '../../helper/api';

function Dashboard() {


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className="App gradient-background">
            <div id="main-content-container">
                <div id="main-content-wrapper">
                    
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
