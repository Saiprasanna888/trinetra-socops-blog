import { Link } from 'react-router-dom';
import { TAG_COLORS } from '../data/samplePosts';

function PostCard({ post, index = 0 }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.seconds
            ? new Date(timestamp.seconds * 1000)
            : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return 'TS';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };



    return (
        <div className={`post-card animate-fade-in-up stagger-${(index % 6) + 1}`} style={{ position: 'relative' }}>
            <Link
                to={`/post/${post.id}`}
                style={{ textDecoration: 'none', opacity: 0, display: 'block', height: '100%', width: '100%' }}
            >
                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="post-card-image"
                        loading="lazy"
                    />
                )}
                {!post.featuredImage && (
                    <div
                        className="post-card-image"
                        style={{
                            background: `linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            opacity: 0.4
                        }}
                    >
                        ◈
                    </div>
                )}
                <div className="post-card-body">
                    <div className="post-card-meta">
                        <span className="post-card-category">{post.category}</span>
                    </div>
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>
                    <div className="post-card-footer">
                        <div className="post-card-author">
                            <div className="avatar">{getInitials(post.author)}</div>
                            <span style={{ color: 'var(--text-secondary)' }}>{post.author}</span>
                        </div>
                        <div className="post-card-tags">
                            {post.tags?.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className={`tag tag-${TAG_COLORS[tag] || TAG_COLORS.default}`}
                                    style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
            <button
                className="post-card-share-btn"
                title="Copy Link"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = `${window.location.origin}/post/${post.id}`;
                    navigator.clipboard.writeText(url);
                    // Simple alert for feedback since we don't have a global toast yet
                    // or better, find a way to show "Copied" locally
                }}
            >
                <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
            </button>
        </div>
    );
}

export default PostCard;
