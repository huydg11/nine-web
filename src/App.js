import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Layout from './layouts/Layout.js';
import AdminLayout from './layouts/AdminLayout.js';
import PrivateRoute from './components/privateRoute.js';

import Home from './pages/home.js';
import Project from './pages/project.js';
import ProjectDetail from './pages/project-detail.js';
import Login from './pages/admin/login.js';
import AboutUs from './pages/about.js';
import Donate from './pages/donate.js';
import Error from './components/error.js';
import Dashboard from './pages/admin/dashboard.js';
import ContentAdminList from './pages/admin/contentlist.js';
import CreateProject from './pages/admin/createproject.js';
import AdminProjectDetail from './pages/admin/detail.js';
import DonationHistory from './pages/admin/donationHistory.js';
import Account from './pages/admin/account.js';
import CreateAccount from './pages/admin/createAccount.js';
import UpdateAccount from './pages/admin/updateAccount.js';
import ChangePassword from './pages/admin/changePassword.js';

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
    { path: '/admin/portal/login', element: <Login />, noLayout: true },

    // Protected admin routes
    {
      path: '/admin/dashboard',
      element: <PrivateRoute><Dashboard /></PrivateRoute>
    },
    {
      path: '/admin/create/',
      element: <PrivateRoute><CreateProject /></PrivateRoute>
    },
    {
      path: '/admin/list/*',
      element: <PrivateRoute><ContentAdminList /></PrivateRoute>
    },
    {
      path: '/admin/edit/*',
      element: <PrivateRoute><AdminProjectDetail /></PrivateRoute>
    },
    {
      path: '/admin/donation/',
      element: <PrivateRoute><DonationHistory /></PrivateRoute>
    },
    {
      path: '/admin/account/',
      element: <PrivateRoute><Account /></PrivateRoute>
    },
    {
      path: '/admin/account/create',
      element: <PrivateRoute><CreateAccount /></PrivateRoute>
    },
    {
      path: '/admin/account/update/*',
      element: <PrivateRoute><UpdateAccount /></PrivateRoute>
    },
    {
      path: '/admin/account/changepassword/',
      element: <PrivateRoute><ChangePassword /></PrivateRoute>
    },
  ];

  return (
    <Routes>
      {routes.map(({ path, element, noLayout }, i) => {
        if (noLayout) {
          return <Route key={i} path={path} element={element} />;
        }

        if (path.startsWith('/admin')) {
          return (
            <Route
              key={i}
              path={path}
              element={<AdminLayout>{element}</AdminLayout>}
            />
          );
        }

        return (
          <Route
            key={i}
            path={path}
            element={<Layout>{element}</Layout>}
          />
        );
      })}

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
