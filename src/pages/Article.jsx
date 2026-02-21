import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import samplePosts, { TAG_COLORS } from '../data/samplePosts';
import { getPost, incrementViews } from '../services/posts';
import { isSupabaseConfigured } from '../supabase';

function Article() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            if (!isSupabaseConfigured) {
                const sample = samplePosts.find((p) => p.id === id);
                setPost(sample || null);
                setLoading(false);
                return;
            }

            try {
                const supabasePost = await getPost(id);
                if (supabasePost) {
                    setPost(supabasePost);
                } else {
                    const sample = samplePosts.find((p) => p.id === id);
                    setPost(sample || null);
                }
            } catch {


                const sample = samplePosts.find((p) => p.id === id);
                setPost(sample || null);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.seconds
            ? new Date(timestamp.seconds * 1000)
            : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '16px' }}>Article Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    The article you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/" className="btn btn-primary">
                    ← Back to Home
                </Link>
            </div>
        );
    }

    return (
        <article className="article-page container-narrow animate-fade-in">
            <div className="article-header">
                {post.category && (
                    <Link
                        to={`/category/${encodeURIComponent(post.category)}`}
                        className={`tag tag-${TAG_COLORS[post.category] || TAG_COLORS.default} category-badge`}
                    >
                        {post.category}
                    </Link>
                )}
                <h1>{post.title}</h1>
                <div className="article-meta">
                    <span>{post.author}</span>
                    <span className="dot"></span>
                    <span>{formatDate(post.createdAt)}</span>
                </div>
            </div>

            {post.featuredImage && (
                <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="article-featured-img"
                />
            )}

            <div
                className="article-content"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content, {
                        ADD_TAGS: ['iframe'],
                        ADD_ATTR: ['allowfullscreen', 'frameborder', 'src', 'allow']
                    })
                }}
            />

            {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
                    {post.tags.map((tag) => (
                        <Link
                            to={`/tag/${encodeURIComponent(tag)}`}
                            key={tag}
                            className={`tag tag-${TAG_COLORS[tag] || TAG_COLORS.default}`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <Link to="/" className="btn btn-secondary">
                    ← Back to All Articles
                </Link>
            </div>
        </article>
    );
}

export default Article;
