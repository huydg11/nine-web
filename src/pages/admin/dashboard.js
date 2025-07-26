import React, { useEffect, useState } from 'react';
import { getJSON } from '../../helper/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, Briefcase, DollarSign } from 'lucide-react';
import NineLogo from '../../resources/logo/nine-logo-white.png';

function Dashboard() {
  const [counts, setCounts] = useState({
    staff: 0,
    posts: 0,
    completed: 0,
    ongoing: 0,
    partner: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchCounts() {
      try {
        const [staffData, postData, completedData, ongoingData, partnerData, txData] = await Promise.all([
          getJSON('/Admin/getStaff'),
          getJSON('/Project/sortedNineListPost'),
          getJSON('/Project/sortedNineListCompleted'),
          getJSON('/Project/sortedNineListOnGoing'),
          getJSON('/Project/sortedNineListPartner'),
          getJSON('/Donation/GetTransactionHistory'),
        ]);

        setCounts({
          staff: staffData.length,
          posts: postData.length,
          completed: completedData.length,
          ongoing: ongoingData.length,
          partner: partnerData.length,
          transactions: txData.length,
        });
      } catch (err) {
        console.error('Failed to load counts', err);
        setError('Could not load dashboard counts.');
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <header className="flex items-center mb-10">
          <LazyLoadImage src={NineLogo} alt="Nine Logo" className="h-12 w-auto mr-3" />
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h1>
        </header>

        {/* Grid of count cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CountCard icon={<Users size={28} />} label="Staff" number={counts.staff} />
          <CountCard icon={<FileText size={28} />} label="Posts" number={counts.posts} />
          <CountCard icon={<CheckCircle size={28} />} label="Completed" number={counts.completed} />
          <CountCard icon={<Clock size={28} />} label="Ongoing" number={counts.ongoing} />
          <CountCard icon={<Briefcase size={28} />} label="Partner" number={counts.partner} />
          <CountCard icon={<DollarSign size={28} />} label="Transactions" number={counts.transactions} />
        </div>
      </div>
    </div>
  );
}

function CountCard({ icon, label, number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 250 }}
      className="flex flex-col items-center bg-white rounded-xl shadow-md p-4"
    >
      <div className="mb-3 text-indigo-500">{icon}</div>
      <h3 className="text-lg font-medium text-gray-700 mb-1">{label}</h3>
      <p className="text-4xl font-bold text-gray-900">{number}</p>
    </motion.div>
  );
}

export default Dashboard;