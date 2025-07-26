import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../../resources/logo/nine-logo-white.png';
import { useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Check if the current path matches any of the dropdown items
    const isProjectActive = location.pathname.startsWith('/project');

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleDropdownClose = () => setDropdownOpen(false);

    // Close the dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar && window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else if (navbar) {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header>
            <nav className="navbar css-selector navbar-expand-lg navbar-light bg-light fixed-top">
                <NavLink className="navbar-brand" to="/">
                    <img
                        src={Logo}
                        width="60"
                        height="60"
                        className="d-inline-block align-top"
                        alt="logo"
                    />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav semibold">
                        <li className="nav-item">
                            <NavLink
                                exact
                                className="nav-link"
                                to="/"
                                activeClassName="active"
                            >
                                Trang chủ <span className="sr-only">(current)</span>
                            </NavLink>
                        </li>

                        <li
                            className={`nav-item dropdown ${isProjectActive ? 'active' : ''
                                } ${isDropdownOpen ? 'show' : ''}`}
                            ref={dropdownRef}
                        >
                            <span
                                className="nav-link dropdown-toggle cursor-pointer"
                                id="navbarDropdownMenuLink"
                                onClick={toggleDropdown}
                                style={{ cursor: 'pointer' }}
                            >
                                Dự án
                            </span>
                            <div
                                className={`dropdown-menu ${isDropdownOpen ? 'show' : ''
                                    }`}
                                aria-labelledby="navbarDropdownMenuLink"
                            >
                                <Link
                                    className="dropdown-item"
                                    to="/project"
                                    onClick={handleDropdownClose}
                                >
                                    Tất cả dự án
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to="/project/finished"
                                    onClick={handleDropdownClose}
                                >
                                    Dự án đã hoàn thành
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to="/project/on-going"
                                    onClick={handleDropdownClose}
                                >
                                    Dự án đang tiến hành
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to="/project/partner"
                                    onClick={handleDropdownClose}
                                >
                                    Dự án của đối tác
                                </Link>
                            </div>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/post"
                                activeClassName="active"
                            >
                                Bài viết
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/about"
                                activeClassName="active"
                            >
                                About us
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/donate"
                                activeClassName="active"
                            >
                                Donate
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;
