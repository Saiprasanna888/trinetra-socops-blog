import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../../services/posts';
import { isSupabaseConfigured } from '../../supabase';
import samplePosts from '../../data/samplePosts';

function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingSample, setUsingSample] = useState(false);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        if (!isSupabaseConfigured) {
            setPosts(samplePosts);
            setUsingSample(true);
            setLoading(false);
            return;
        }

        try {
            const data = await getPosts('all');
            if (data.length > 0) {
                setPosts(data);
                setUsingSample(false);
            } else {
                setPosts(samplePosts);
                setUsingSample(true);
            }
        } catch (error) {
            console.log('Using sample data:', error.message);
            setPosts(samplePosts);
            setUsingSample(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (usingSample) {
            alert('Cannot delete sample posts. Configure Supabase and create your own posts!');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await deletePost(id);
            fetchPosts();
        } catch (error) {
            alert('Error deleting post: ' + error.message);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '—';
        const date = timestamp.seconds
            ? new Date(timestamp.seconds * 1000)
            : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const draftCount = posts.filter((p) => p.status === 'draft').length;

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="admin-topbar">
                <h1>Dashboard</h1>
                <Link to="/admin/new" className="btn btn-primary">
                    ✏️ New Post
                </Link>
            </div>

            {usingSample && (
                <div className="admin-alert">
                    ℹ️ Showing sample data. Configure Supabase and create posts to see your own content here.
                </div>

            )}

            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-value">{posts.length}</div>
                    <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value text-success">
                        {publishedCount}
                    </div>
                    <div className="stat-label">Published</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value text-warning">
                        {draftCount}
                    </div>
                    <div className="stat-label">Drafts</div>
                </div>
            </div>

            <div className="section-header">
                <h2>All Posts</h2>
                <div className="accent-line"></div>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td className="table-title">
                                {post.title}
                            </td>
                            <td>
                                <span
                                    className={`status-badge ${post.status === 'published'
                                        ? 'status-published'
                                        : 'status-draft'
                                        }`}
                                >
                                    {post.status}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() =>
                                            usingSample
                                                ? alert('Cannot edit sample posts.')
                                                : navigate(`/admin/edit/${post.id}`)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {posts.length === 0 && (
                <div className="empty-state">
                    <h3>No posts yet</h3>
                    <p>Create your first article to get started.</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
