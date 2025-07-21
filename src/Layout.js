
import React from 'react';
import Header from './pages/header-footer/header.js';

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>  
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
