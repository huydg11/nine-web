import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import '../style/home.css';
import '../style/main-content.css';
import Banner from '../components/banner';

// Import components
import NineCard from '../components/ninecard';
import FacebookDiscord from '../components/facebook-discord';
import RecommendPost from '../components/recommend';
import NoResult from '../components/noresult';

import HeadingRecommend from "../resources/banner, etc/list, about us heading/heading-recommend.png";
import { getJSON } from '../helper/api';

function Project() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [postList, setPostList] = useState([]);
    const [randomThreePosts, setRandomThreePosts] = useState([]);
    const [queryMessage, setQueryMessage] = useState('');
    const [searchMessage, setSearchMessage] = useState('Tìm kiếm dự án tại đây...');
    const itemsPerPage = 6;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPostList(location.pathname);
        fetchRandomThreePosts();

        setCurrentPage(1);
        setSearchTerm('');
        setDebouncedSearchTerm('');
        clearTimeout(debounceTimeout);
        setDebounceTimeout(null);
    }, [location.pathname]);

    const fetchPostList = async (path) => {
        let endpoint = '';
        let message = '';
        let searchMsg = 'Tìm kiếm dự án tại đây...';

        switch (path) {
            case '/project':
                endpoint = '/Project/sortedNineListProject';
                message = 'Dự án Việt Ngữ';
                break;
            case '/post':
                endpoint = '/Project/sortedNineListPost';
                message = 'Bài viết';
                searchMsg = 'Tìm kiếm bài viết tại đây...';
                break;
            case '/project/finished':
                endpoint = '/Project/sortedNineListCompleted';
                message = 'Dự án đã hoàn thành';
                break;
            case '/project/on-going':
                endpoint = '/Project/sortedNineListOnGoing';
                message = 'Dự án đang tiến hành';
                break;
            case '/project/partner':
                endpoint = '/Project/sortedNineListPartner';
                message = 'Dự án của đối tác';
                break;
            default:
                setPostList([]);
                setQueryMessage('');
                setSearchMessage(searchMsg);
                return;
        }

        try {
            const data = await getJSON(endpoint);
            setPostList(data);
        } catch (err) {
            console.error('Error fetching postList:', err);
            setPostList([]);
        }

        setQueryMessage(message);
        setSearchMessage(searchMsg);
    };

    const fetchRandomThreePosts = async () => {
        try {
            const data = await getJSON('/Home/random-three');
            setRandomThreePosts(data);
        } catch (err) {
            console.error('Error fetching randomThreePosts:', err);
            setRandomThreePosts([]);
        }
    };

    const filteredItems = postList.filter(post =>
        (post.heading && post.heading.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            setDebouncedSearchTerm(value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);

        setDebounceTimeout(newTimeout);
        setCurrentPage(1);
    };

    return (
        <div className="App">
            <Banner />

            <div id="main-content-container">
                <div id="second-main-wrapper">
                    <div id="post-main-wrapper">
                        <div className="query-message">
                            <span className="query-message-text">Hiển thị kết quả cho: {queryMessage}</span>
                        </div>

                        {currentItems.length > 0 && (
                            <div id="grid-post-wrapper">
                                {currentItems.map((post) => (
                                    <NineCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                        {currentItems.length === 0 && <NoResult />}

                        {currentItems.length > 0 && (
                            <div className="pagination-wrapper">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    ←
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>

                    <div id="side-bar-wrapper" style={{ marginTop: '7rem' }}>
                        <div className="search-bar">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder={searchMessage}
                                className="search-input"
                            />
                        </div>

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
                                {randomThreePosts.map((post) => (
                                    <RecommendPost key={post.id} post={post} />
                                ))}
                            </div>
                        </div>

                        <FacebookDiscord />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;
