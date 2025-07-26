import React, { useEffect } from 'react';
import AdminNavbar from '../components/admin-header-footer/adminheader';
import Sidebar from '../components/admin-header-footer/adminsiderbar';

import '../style/tailwind.css';
import '../style/index.css';

export default function AdminLayout({ children }) {
  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="admin-app">
      <Sidebar/>
      <div className="relative md:ml-64">
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
         {children}
        </div>
      </div>
    </div>
  );

}
