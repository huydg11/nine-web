import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


import TranslationProgress from '../../../components/project-post-render/translationprogress';
import DownloadMenu from '../../../components/project-post-render/download-render';
import PatchHistory from '../../../components/project-post-render/patch-history-render';


function NineRender({ project }) {

    const authorLabel = project.type === 'post' ? 'Author' : 'By';
    let authorColor = "#013b57";

    if (project.by === 'Gero Saga') {
        authorColor = "#013b57";
    } else if (project.by === 'Nine Translation') {
        authorColor = "#00A0CF";
    }

    const formatRole = (role) => {
        const roleMapping = {
            project_manager: 'Quản lí dự án',
            translator: 'Dịch thuật',
            editor: 'Biên dịch',
            tech: 'Kĩ thuật',
            ui: "Mỹ thuật",
            qa: 'Kiểm tra chất lượng'
        };
        return roleMapping[role] || role;
    };

    return (


        <div id="project-content-wrapper">
            <h1 className="project-title semibold" style={{ color: '#01545c' }}>{project.heading}</h1>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <span className="post-tags" style={{ fontSize: '1.5rem' }}>
                    <em>{authorLabel}</em> <a style={{color: authorColor}}>{project.by}</a>
                </span>
                <p className="card-text" style={{ fontSize: '1.5rem', marginTop: '0px' }}><small className="text-muted">{project.date}</small></p>
            </div>

            <div style={{ aspectRatio: '16 / 9' }}>
                <LazyLoadImage
                    src={project.thumbnail}
                    alt={project.heading}
                    effect="blur"
                    placeholderSrc=""
                    style={{ width: '100%', height: 'fit-content' }}
                />
            </div>


            <div id="project-main-content">

                {/* Heading */}

                <div id="heading">

                    <div id="heading-content">
                        <div className="heading-text">
                            <b>Nhà phát hành:</b> {project?.detail?.publisher ?? 'N/A'}
                        </div>
                        <div className="heading-text">
                            <b>Ngày phát hành:</b> {project?.detail?.release_date ?? 'N/A'}
                        </div>
                        <div className="heading-text">
                            <b>Độ dài:</b> {project?.detail?.playtime ?? 'N/A'}
                        </div>
                        <div className="heading-text">
                            <b>Thể loại:</b> {project?.detail?.genre ?? 'N/A'}
                        </div>
                        <div className="heading-text">
                            <b>VNDB:</b>{' '}
                            {project?.detail?.vndbLink ? (
                                <a href={project.detail.vndbLink}>{project.detail.vndbLink}</a>
                            ) : (
                                'N/A'
                            )}
                        </div>
                        <div className="heading-text">
                            <b>Trang chủ:</b>{' '}
                            {project?.detail?.officialPage ? (
                                <a href={project.detail.officialPage}>{project.detail.officialPage}</a>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    </div>

                </div>

                {/* Description */}

                {project?.detail?.fullDescription && (
                    <>
                        <div className="heading-title">Nội dung:</div>
                        <div
                            id="content-detail"
                            style={{ fontSize: '1.5rem', color: '#3c3d3d' }}
                            dangerouslySetInnerHTML={{ __html: project.detail.fullDescription }}
                        ></div>
                    </>
                )}


                {/* Translation Progress */}


                {project?.translationProgress && (
                    <>
                        <div className="heading-title">Tiến độ dịch:</div>
                        <TranslationProgress
                            translate={project.translationProgress.translate}
                            edit={project.translationProgress.edit}
                            QA={project.translationProgress.qa}
                            lastUpdated={project.translationProgress.lastUpdated}
                        />
                    </>
                )}



                {/* Staff */}

                {project?.detail?.staff && Object.entries(project.detail.staff).length > 0 && (
                    <>
                        <div className="heading-title">Nhân sự:</div>
                        <div id="staff-list">
                            {Object.entries(project.detail.staff).map(([role, members]) => (
                                <div key={role} style={{ textAlign: 'center', fontSize: '1.6rem' }}>
                                    <b style={{ color: '#039dab' }}>{formatRole(role)}</b>
                                    <p>{members.join(", ")}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}


                {/* Demo Video */}

                {project?.detail?.demoVideoUrl && (
                    <>
                        <div className="heading-title">Demo Việt Ngữ:</div>
                        <div>
                            <div id="responsive-video-wrapper">
                                <iframe
                                    width="900"
                                    height="504"
                                    style={{ maxWidth: '900px' }}
                                    src={`https://www.youtube.com/embed/${project.detail.demoVideoUrl}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </>
                )}

                {/* Download Link */}

                {project?.detail?.downloadDetail && Object.entries(project.detail.downloadDetail).length > 0 && (
                    <>
                        <div className="heading-title">Link tải & Video hướng dẫn:</div>
                        <DownloadMenu
                            title={project.title}
                            by={project.by}
                            patch_size={project.detail.patchSize}
                            patch_version={project.detail.downloadDetail.patchVersion}
                            official_link={project.detail.downloadDetail.officialLink}
                            download_1={project.detail.downloadDetail.download1}
                            download_2={project.detail.downloadDetail.download2}
                            download_3={project.detail.downloadDetail.download3}
                            tutorial_video_link={project.detail.downloadDetail.tutorialVideoLink}
                        />
                    </>
                )}



                {/* Version History */}

                {project?.detail?.patchHistory && Object.entries(project.detail.patchHistory).length > 0 && (
                    <>
                        <div className='heading-title'>Lịch sử phiên bản:</div>
                        <PatchHistory patch_history={project.detail.patchHistory} />
                    </>
                )}

                {/* Note Report */}

                {project.type != "post" && (
                    <>
                        <div className='heading-title'>Lưu ý:</div>

                        <div className='note-wrapper'>
                            <ul>
                                <li>
                                    Patch việt ngữ và launcher chỉ tương thích với phiên bản game bản quyền kèm DLC (nếu có) trên Steam.
                                    Nine Translation sẽ từ chối hỗ trợ, sửa lỗi cho bất cứ các phiên bản lậu của tựa game trôi nổi bên ngoài.
                                </li>
                                <li>Vui lòng đọc, xem kĩ video hướng dẫn cài bản dịch trước khi nhắn tin hỏi nhóm.</li>
                                <li>
                                    Các web khác leech bản dịch vui lòng để link download trỏ về website của Nine Translation để đảm bảo người đọc được tiếp cận với patch việt ngữ mới nhất.
                                </li>
                                <li>Vui lòng không sửa đổi, tái phát hành bản dịch (launcher) của Nine Translation mà chưa xin phép.</li>
                            </ul>
                        </div>
                    </>
                )}


            </div>




        </div>
    );
}

export default NineRender;
