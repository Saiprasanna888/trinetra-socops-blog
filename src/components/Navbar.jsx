import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data/samplePosts';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">◈</div>
                    <span>Trinetra<span className="accent">SOCops</span></span>
                </Link>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <Link
                            to="/"
                            className={location.pathname === '/' ? 'active' : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    {CATEGORIES.map((cat) => (
                        <li key={cat}>
                            <Link
                                to={`/category/${encodeURIComponent(cat)}`}
                                className={
                                    location.pathname === `/category/${encodeURIComponent(cat)}`
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setMenuOpen(false)}
                            >
                                {cat}
                            </Link>
                        </li>
                    ))}
                    {currentUser && (
                        <li>
                            <Link
                                to="/admin"
                                className={location.pathname.startsWith('/admin') ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                                style={{ color: 'var(--cyber-green)' }}
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}
                </ul>

                <form onSubmit={handleSearch} className="navbar-search">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
