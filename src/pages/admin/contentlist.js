import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NineLogo from '../../resources/logo/nine-logo-white.png';


import { getJSON } from '../../helper/api';

function ContentList() {
    const location = useLocation();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchMessage, setSearchMessage] = useState('Tìm kiếm dự án tại đây...');
    const [postList, setPostList] = useState([]);
    const itemsPerPage = 12;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPostList(location.pathname);
        setCurrentPage(1);
        setSearchTerm('');
        setDebouncedSearchTerm('');
        clearTimeout(debounceTimeout);
        setDebounceTimeout(null);
    }, [location.pathname]);

    const fetchPostList = async (path) => {
        let endpoint = '';
        let searchMsg = 'Tìm kiếm dự án tại đây...';

        switch (path) {
            case '/admin/list/project':
                endpoint = '/Admin/getAllProject';
                break;
            case '/admin/list/post':
                endpoint = '/Admin/getAllPosts';
                searchMsg = 'Tìm kiếm bài viết tại đây...';
                break;
            default:
                setPostList([]);
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

        setSearchMessage(searchMsg);
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
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
            setDebouncedSearchTerm(value);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);

        setDebounceTimeout(timeout);
        setCurrentPage(1);
    };

    const handleDisable = async (finder) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://localhost:7295/api/Project/disableProject/${encodeURIComponent(finder)}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                // Optionally show success message or refresh the list
                alert('Project disabled successfully');
                fetchPostList(location.pathname); // Refresh list
            } else {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        } catch (error) {
            console.error('Error disabling project:', error);
            alert(`An error occurred while disabling the project: ${error.message}`);
        }
    };

    const handleSetCarousel = async (id) => {
        try {
            await getJSON(`/Project/setCarousel/${id}`);
            alert('Carousel updated successfully');
            fetchPostList(location.pathname); // Refresh the list
        } catch (error) {
            console.error('Error setting carousel:', error);
            alert(`An error occurred while setting the carousel: ${error.message}`);
        }
    };


    return (
        <div className="App gradient-background p-4">
            {/* Header */}
            <div className="flex items-center mb-4">
                <LazyLoadImage src={NineLogo} alt="Logo" className="h-10 w-auto mr-2" />
                <h1 className="text-2xl font-bold">Danh Sách Nội Dung</h1>
            </div>



            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder={searchMessage}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2"
                />

                <button
                    onClick={() => navigate(`/admin/create`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                >
                    Create
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Heading</th>
                            <th className="py-2 px-4">Finder</th>
                            <th className="py-2 px-4">Type</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Carousel?</th>
                            <th className="py-2 px-4">Active?</th>
                            <th className="py-2 px-4">By</th>
                            <th className="py-2 px-4"></th>
                            <th className="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(post => (
                            <tr key={post.id} className="border-t">
                                <td className="py-2 px-4">{post.id}</td>
                                <td className="py-2 px-4">{post.heading}</td>
                                <td className="py-2 px-4">{post.finder || '-'}</td>
                                <td className="py-2 px-4">{post.type || '-'}</td>
                                <td className="py-2 px-4">{post.status || '-'}</td>
                                <td className="py-2 px-4">{post.isCarousel ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4">{post.isActive ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4">{post.by || '-'}</td>
                                <td className="py-2 px-4">
                                    <button style={{ background: 'blue' }}
                                        onClick={() => navigate(`/admin/edit/${post.finder}`)}
                                        className="bg-blue-500 hover:bg-blue-600 text-black py-1 px-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to set this as carousel?")) {
                                                handleSetCarousel(post.id);
                                            }
                                        }}
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded" style={{ background: 'green' }}
                                    >
                                        Set carousel
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to disable this?")) {
                                                handleDisable(post.finder);
                                            }
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                                    >
                                        {post.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-4 text-center text-gray-500">
                                    Không có kết quả hợp lệ.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {currentItems.length > 0 && (
                <div className="pagination-wrapper flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border"
                    >
                        ←
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 rounded border ${currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContentList;
