
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout.js';
import Home from './pages/home.js';
import Project from './pages/project.js';
import ProjectDetail from './pages/project-detail.js';
import Login from './pages/admin/login.js';
import AboutUs from './pages/about.js';
import Donate from './pages/donate.js'
import Error from './components/error.js';

import './style/global.css';
import './style/header.css';


function App() {

  useEffect(() => {
    document.body.style.background = `repeating-linear-gradient(-45deg, rgb(245 251 253) 0px, rgb(245 251 253) 10px, rgb(238 247 250) 10px, rgb(238 247 250) 14px)`;

    return () => {
      document.body.style.background = '';
    };
  }, []);

  
  const routes = [
    { path: '/', element: <Home /> },
    { path: '/project', element: <Project /> },
    { path: '/project/finished', element: <Project /> },
    { path: '/project/on-going', element: <Project /> },
    { path: '/project/partner', element: <Project /> },
    { path: '/post', element: <Project /> },
    { path: '/project/nine/*', element: <ProjectDetail /> },
    { path: '/post/*', element: <ProjectDetail /> },
    { path: '/about', element: <AboutUs/> },
    { path: '/donate', element: <Donate/> },
    {path: '/admin/portal/login', element: <Login/> }, 
  ];

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <Layout>
                {element}
              </Layout>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <Layout>
              <Error />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
