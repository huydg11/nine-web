import React, { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';

function DownloadMenu({title, by, patch_size, patch_version, official_link, download_1, download_2, download_3, tutorial_video_link}) {

    const [activeTab, setActiveTab] = useState('google-tab');
   

    return (
        <div id="download-content">

                    <div className="card-tittle" style={{ textAlign: 'center' }} >
                        <h3>{title} Patch Việt Ngữ by {by}</h3>

                        <p>Dung lượng patch: {patch_size}</p>
                    </div>



                    <div className="card-body">
                        <div className="tab tab3" style={{ padding: 0 }}>
                            <div className="item-navigation" style={{ textAlign: 'center' }}>
                                <ul className="nav nav-tabs nav--tabs2" role="tablist">

                                    <li>
                                        <a
                                            href="#google-tab"
                                            aria-controls="google-tab"
                                            role="tab"
                                            data-toggle="tab"
                                            aria-expanded="true"
                                            aria-selected={activeTab === 'google-tab'}
                                            className='active'
                                            onClick={() => setActiveTab('google-tab')}
                                        >
                                            Google Drive
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#sub-tab-1"
                                            aria-controls="sub-tab-1"
                                            role="tab"
                                            data-toggle="tab"
                                            aria-expanded="false"
                                            aria-selected={activeTab === 'sub-tab-1'}
                                            onClick={() => setActiveTab('sub-tab-1')}
                                        >
                                            Dự phòng 1
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#sub-tab-2"
                                            aria-controls="sub-tab-2"
                                            role="tab"
                                            data-toggle="tab"
                                            aria-expanded="false"
                                            aria-selected={activeTab === 'sub-tab-2'}
                                            onClick={() => setActiveTab('sub-tab-2')}
                                        >
                                            Dự phòng 2
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div id="download-tab-content" className="tab-content" style={{ padding: '2rem 0!important' }}>
                                {activeTab === 'google-tab' && (
                                    <div role="tabpanel" className="fade tab-pane product-tab active show" id="google-tab">
                                        <div className="tab-content-wrapper">
                                            <p style={{ textAlign: 'center' }}>
                                                <strong>
                                                    <span className='patch-type' style={{ fontSize: '2rem' }}>
                                                        -Phiên bản PC Steam-
                                                    </span>
                                                </strong>
                                            </p>

                                            <p style={{ textAlign: 'center' }}>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={official_link} target="_blank" >
                                                        <strong  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Link mua game bản quyền trên Steam </span> 
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={download_1} target="_blank">
                                                        <strong  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Download patch Việt Ngữ v{patch_version} (Launcher by Hoshi Visual Novel) </span>
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                            </p>

                                            <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: '500' }}>Mật khẩu giải nén patch: <span style={{ fontWeight: '600', color: '#009292' }}>ninetranslation.com</span></p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'sub-tab-1' && (
                                    <div role="tabpanel" className="fade tab-pane product-tab" id="sub-tab-1">
                                        <div className="tab-content-wrapper">
                                            <p style={{ textAlign: 'center' }}>
                                                <strong>
                                                    <span className='patch-type' style={{ fontSize: '2rem' }}>
                                                        -Phiên bản PC Steam-
                                                    </span>
                                                </strong>
                                            </p>

                                            <p style={{ textAlign: 'center' }}>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={official_link} target="_blank" >
                                                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Link mua game bản quyền trên Steam </span>
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={download_2} target="_blank">
                                                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Download patch Việt Ngữ v{patch_version} (Launcher by Hoshi Visual Novel) </span>
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                            </p>

                                            <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: '500' }}>Mật khẩu giải nén patch: <span style={{ fontWeight: '600', color: '#009292' }}>ninetranslation.com</span></p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'sub-tab-2' && (
                                    <div role="tabpanel" className="fade tab-pane product-tab" id="sub-tab-2">
                                        <div className="tab-content-wrapper">
                                            <p style={{ textAlign: 'center' }}>
                                                <strong>
                                                    <span className='patch-type' style={{ fontSize: '2rem' }}>
                                                        -Phiên bản PC Steam-
                                                    </span>
                                                </strong>
                                            </p>

                                            <p style={{ textAlign: 'center' }}>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={official_link} target="_blank" >
                                                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Link mua game bản quyền trên Steam </span>
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                                <div className="download-link" style={{ textAlign: 'center' }}>
                                                    <a href={download_3} target="_blank">
                                                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>Download patch Việt Ngữ v{patch_version} (Launcher by Hoshi Visual Novel) </span>
                                                            <FaLink style={{ color: '#01a9d7', fontSize: '1.4rem' }} />
                                                        </strong>
                                                    </a>
                                                </div>

                                            </p>

                                            <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: '500' }}>Mật khẩu giải nén patch: <span style={{ fontWeight: '600', color: '#009292' }}>ninetranslation.com</span></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ margin: '1.25rem', borderTop: '1px solid #dee2e6', paddingTop: '2rem' }}>


                        <div className="download-link" style={{ textAlign: 'center' }}>
                            <a href={tutorial_video_link} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong>
                                    <span style={{ fontSize: '1.8rem' }}>Video hướng dẫn cài đặt</span>
                                </strong>
                                <FaYoutube style={{ color: 'red', fontSize: '2rem' }} />
                            </a>
                        </div>



                    </div>





                </div>
    );
}

export default DownloadMenu;
