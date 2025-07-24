import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NineLogo from '../../resources/logo/nine-logo-white.png';

import '../../style/admin.css';

import { getJSON } from '../../helper/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Please fill in both username and password.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('https://localhost:7295/api/Login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                throw new Error(`Login failed (${res.status})`);
            }

            const { token } = await res.json();
            localStorage.setItem('authToken', token);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="App gradient-background">
            <div id="main-content-container">
                <div id="main-content-wrapper">
                    <div id="admin-login-wrapper">
                        <div id="admin-login-content">

                            <div id="login-heading-content">
                                <div id="login-logo-wrapper">
                                    <LazyLoadImage
                                        className="card-img-top"
                                        src={NineLogo}
                                        alt="Logo"
                                        effect="blur"
                                    />
                                </div>
                                <div id="login-text">Admin Login</div>
                            </div>

                            <div id="login-form">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    id="login-input"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    id="login-input"
                                />

                                {error && (
                                    <div style={{ color: 'red', margin: '1rem 0' }}>
                                        {error}
                                    </div>
                                )}

                                <div id="admin-login-button">
                                    <button
                                        className="cssbuttons-io-button"
                                        onClick={handleLogin}
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in…' : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    width="24"
                                                    height="24"
                                                >
                                                    <path fill="none" d="M0 0h24v24H0z" />
                                                    <path
                                                        fill="currentColor"
                                                        d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z"
                                                    />
                                                </svg>
                                                <span>Login</span>
                                            </>
                                        )}
                                    </button>

                                    <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                                        <a
                                            href="https://www.facebook.com/ninetranslation"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="login-link"
                                        >
                                            Forgot your login credentials? Contact admin here.
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
