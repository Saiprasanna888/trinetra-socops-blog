import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import samplePosts, { TAG_COLORS } from '../data/samplePosts';
import { getPostsByCategory } from '../services/posts';
import { isSupabaseConfigured } from '../supabase';

function CategoryPage() {
    const { name } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            if (!isSupabaseConfigured) {
                const filtered = samplePosts.filter(
                    (p) => p.category === name && p.status === 'published'
                );
                setPosts(filtered);
                setLoading(false);
                return;
            }

            try {
                const supabasePosts = await getPostsByCategory(name);
                if (supabasePosts.length > 0) {
                    setPosts(supabasePosts);
                } else {
                    const filtered = samplePosts.filter(
                        (p) => p.category === name && p.status === 'published'
                    );
                    setPosts(filtered);
                }
            } catch {


                const filtered = samplePosts.filter(
                    (p) => p.category === name && p.status === 'published'
                );
                setPosts(filtered);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
        window.scrollTo(0, 0);
    }, [name]);

    const tagColor = TAG_COLORS[name] || TAG_COLORS.default;

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="category-page container animate-fade-in body-offset">
            <header className="category-header">
                <Link to="/" className="back-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7" /></svg>
                    Back to Knowledge Hub
                </Link>
                <div className="category-title-wrap">
                    <span className={`category-tag tag-${tagColor}`}>{name}</span>
                    <h1>{name} <span className="dim">Operations</span></h1>
                </div>
            </header>

            {posts.length > 0 ? (
                <div className="grid-posts">
                    {posts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                    </div>
                    <h3>No Intelligence Gathered Yet</h3>
                    <p>Our threat researchers are currently investigating and preparing documentation for <strong>{name}</strong>. Access will be granted shortly.</p>
                    <Link to="/" className="btn btn-primary">
                        Return to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}

export default CategoryPage;
