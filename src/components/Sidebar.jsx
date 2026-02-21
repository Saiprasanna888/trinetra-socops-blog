import { Link } from 'react-router-dom';

function Sidebar({ posts = [], popularPosts = [] }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.seconds
            ? new Date(timestamp.seconds * 1000)
            : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const recentPosts = posts.slice(0, 5);
    const topPosts = popularPosts.length > 0
        ? popularPosts.slice(0, 5)
        : [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    return (
        <aside className="sidebar">
            {/* Popular Posts */}
            <div className="sidebar-widget">
                <h3>
                    <span className="icon">🔥</span>
                    Popular Posts
                </h3>
                <div className="sidebar-post-list">
                    {topPosts.map((post) => (
                        <Link
                            to={`/post/${post.id}`}
                            key={post.id}
                            className="sidebar-post-item"
                        >
                            <div className="sidebar-post-title">{post.title}</div>
                            <div className="sidebar-post-date">
                                {formatDate(post.createdAt)}
                            </div>
                        </Link>
                    ))}
                </div>
                {topPosts.length === 0 && (
                    <p className="empty-msg">No posts yet.</p>
                )}
            </div>

            {/* Recent Threat Insights */}
            <div className="sidebar-widget">
                <h3>
                    <span className="icon">🛡️</span>
                    Recent Threat Insights
                </h3>
                <div className="sidebar-post-list">
                    {recentPosts.map((post) => (
                        <Link
                            to={`/post/${post.id}`}
                            key={post.id}
                            className="sidebar-post-item"
                        >
                            <div className="sidebar-post-title">{post.title}</div>
                            <div className="sidebar-post-date">
                                {post.category} • {formatDate(post.createdAt)}
                            </div>
                        </Link>
                    ))}
                </div>
                {recentPosts.length === 0 && (
                    <p className="empty-msg">No insights yet.</p>
                )}
            </div>

            {/* Categories Widget */}
            <div className="sidebar-widget">
                <h3>
                    <span className="icon">📂</span>
                    Categories
                </h3>
                <div className="sidebar-cat-list">
                    {['SOC', 'SIEM', 'Threat Hunting', 'Incident Response', 'Malware Analysis'].map(
                        (cat) => (
                            <Link
                                to={`/category/${encodeURIComponent(cat)}`}
                                key={cat}
                                className="sidebar-cat-link"
                            >
                                {cat}
                            </Link>
                        )
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
