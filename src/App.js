import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Layout from './Layout.js';
import Home from './pages/home.js';
import Project from './pages/project.js';
import ProjectDetail from './pages/project-detail.js';
import Login from './pages/admin/login.js';
import AboutUs from './pages/about.js';
import Donate from './pages/donate.js';
import Error from './components/error.js';
import Dashboard from './pages/admin/dashboard.js';

import './style/global.css';
import './style/header.css';

function AppWrapper() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.body.style.background = `repeating-linear-gradient(-45deg, rgb(30, 30, 30) 0px, rgb(30, 30, 30) 10px, rgb(45, 45, 45) 10px, rgb(45, 45, 45) 14px)`;
      document.body.style.color = '';
    } else {
      document.body.style.background = `repeating-linear-gradient(-45deg, rgb(245 251 253) 0px, rgb(245 251 253) 10px, rgb(238 247 250) 10px, rgb(238 247 250) 14px)`;
      document.body.style.color = '';
    }

    return () => {
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [location.pathname]);

  const routes = [
    { path: '/', element: <Home /> },
    { path: '/project', element: <Project /> },
    { path: '/project/finished', element: <Project /> },
    { path: '/project/on-going', element: <Project /> },
    { path: '/project/partner', element: <Project /> },
    { path: '/post', element: <Project /> },
    { path: '/project/nine/*', element: <ProjectDetail /> },
    { path: '/post/*', element: <ProjectDetail /> },
    { path: '/about', element: <AboutUs /> },
    { path: '/donate', element: <Donate /> },
    { path: '/admin/portal/login', element: <Login />, noLayout: true }, // Special case
    { path: '/admin/dashboard', element: <Dashboard />, noLayout: true },
  ];

  return (
    <Routes>
      {routes.map(({ path, element, noLayout }, index) => (
        <Route
          key={index}
          path={path}
          element={
            noLayout ? element : <Layout>{element}</Layout>
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
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
