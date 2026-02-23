import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminLayout() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>
                        ◈ Trinetra<span className="accent">SOCops</span>
                    </h2>
                    <p>Admin Panel</p>
                </div>

                <ul className="admin-nav">
                    <li>
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            📊 Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/new"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            ✏️ New Post
                        </NavLink>
                    </li>
                    <li>
                        <Link
                            to="/"
                        >
                            🌐 View Site
                        </Link>
                    </li>
                </ul>

                <div className="admin-sidebar-footer">
                    <div className="user-email">
                        {currentUser?.email}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger btn-sm logout-btn"
                    >
                        Logout
                    </button>
                </div>

            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
