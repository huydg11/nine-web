import React, { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NineLogo from '../../resources/logo/nine-logo-white.png';

import { getJSON } from '../../helper/api';

function DonationHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [donationList, setDonationList] = useState([]);
    const itemsPerPage = 10;
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const data = await getJSON('/Donation/GetTransactionHistory');
            setDonationList(data);
        } catch (err) {
            console.error('Error fetching donation history:', err);
            setDonationList([]);
        }
    };

    const filteredItems = donationList
        .filter(d =>
            d.userEmail?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            d.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortField) return 0;

            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === 'status') {
                valA = valA?.toLowerCase();
                valB = valB?.toLowerCase();
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });


    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };


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

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN'); // Format date to Vietnamese style
    };

    return (
        <div className="App gradient-background p-4">
            {/* Header */}
            <div className="flex items-center mb-4">
                <LazyLoadImage src={NineLogo} alt="Logo" className="h-10 w-auto mr-2" />
                <h1 className="text-2xl font-bold">Lịch sử quyên góp</h1>
            </div>

            {/* Search Input */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo email hoặc mô tả..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4">ID</th>
                            <th className="py-2 px-4">Ngày giao dịch</th>
                            <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('amount')}>
                                Số tiền (VND) {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-2 px-4">Email người dùng</th>
                            <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('status')}>
                                Trạng thái {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-2 px-4">Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(donation => (
                            <tr key={donation.id} className="border-t">
                                <td className="py-2 px-4">{donation.id}</td>
                                <td className="py-2 px-4">{formatDate(donation.transactionDate)}</td>
                                <td className="py-2 px-4">{donation.amount.toLocaleString()}</td>
                                <td className="py-2 px-4">{donation.userEmail}</td>
                                <td className="py-2 px-4">{donation.status}</td>
                                <td className="py-2 px-4">{donation.description || '-'}</td>
                            </tr>
                        ))}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                    Không có quyên góp nào phù hợp.
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

export default DonationHistory;
