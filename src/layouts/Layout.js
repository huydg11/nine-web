
import React from 'react';
import Header from '../components/header-footer/header';

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
