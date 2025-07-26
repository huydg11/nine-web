import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLocation, useNavigate } from 'react-router-dom';
import NineLogo from '../../resources/logo/nine-logo-white.png';

import { getJSON, deleteWithStringBody } from '../../helper/api'; 

function StaffList() {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const data = await getJSON('/Admin/getStaff');
            setStaffList(data);
        } catch (err) {
            console.error('Error fetching staff list:', err);
            setStaffList([]);
        }
    };

    const filteredItems = staffList.filter(s =>
        s.displayName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
        }, 500);

        setDebounceTimeout(timeout);
        setCurrentPage(1);
    };

    const handleDeactivate = async (userID) => {
        try {
            await deleteWithStringBody('/Admin/disableUser', userID);
            alert('Account status changed successfully');
            fetchStaff(); // Refresh staff list
        } catch (error) {
            console.error('Error disabling account:', error);
            alert('An error occurred while disabling the account');
        }
    };

    return (
        <div className="App gradient-background p-4">
            {/* Header */}
            <div className="flex items-center mb-4">
                <LazyLoadImage src={NineLogo} alt="Logo" className="h-10 w-auto mr-2" />
                <h1 className="text-2xl font-bold">Danh sách nhân sự</h1>
            </div>

            {/* Search Input */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2"
                />

                <button
                    onClick={() => navigate(`/admin/account/create`)}
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
                            <th className="py-2 px-4">Tên hiển thị</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Trạng thái</th>
                            <th className="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(staff => (
                            <tr key={staff.id} className="border-t">
                                <td className="py-2 px-4">{staff.id}</td>
                                <td className="py-2 px-4">{staff.displayName}</td>
                                <td className="py-2 px-4">{staff.email}</td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded text-sm ${staff.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {staff.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <button
                                    onClick={() => navigate(`/admin/account/update/${staff.id}`)}
                                    className="bg-blue-500 hover:bg-blue-600 text-black py-1 px-2 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to active this account?")) {
                                            handleDeactivate(staff.id);
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                                >
                                    {staff.isActive ? 'Deactive' : 'Active'}
                                </button>
                            </tr>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500">
                                    Không tìm thấy nhân sự phù hợp.
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

export default StaffList;
