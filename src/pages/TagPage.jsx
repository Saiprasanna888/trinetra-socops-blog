import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import samplePosts, { TAG_COLORS } from '../data/samplePosts';
import { getPostsByTag } from '../services/posts';
import { isSupabaseConfigured } from '../supabase';

function TagPage() {
    const { name } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            if (!isSupabaseConfigured) {
                const filtered = samplePosts.filter(
                    (p) => p.tags?.includes(name) && p.status === 'published'
                );
                setPosts(filtered);
                setLoading(false);
                return;
            }

            try {
                const supabasePosts = await getPostsByTag(name);
                if (supabasePosts.length > 0) {
                    setPosts(supabasePosts);
                } else {
                    const filtered = samplePosts.filter(
                        (p) => p.tags?.includes(name) && p.status === 'published'
                    );
                    setPosts(filtered);
                }
            } catch {


                const filtered = samplePosts.filter(
                    (p) => p.tags?.includes(name) && p.status === 'published'
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
        <div className="category-page container animate-fade-in">
            <div className="category-header">
                <Link to="/" className="btn btn-secondary btn-sm">
                    ← Back
                </Link>
                <h1>
                    <span className={`tag tag-${tagColor}`} style={{ fontSize: '0.9rem', marginRight: '12px' }}>
                        #{name}
                    </span>
                    Tag
                </h1>
            </div>

            {posts.length > 0 ? (
                <div className="grid-posts">
                    {posts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No articles tagged "{name}" yet</h3>
                    <p>Check back soon for new content with this tag.</p>
                </div>
            )}
        </div>
    );
}

export default TagPage;
