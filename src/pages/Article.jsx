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

    const [showToast, setShowToast] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
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

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(post.title || 'Check out this article');

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

            {/* Share Section */}
            <div className="article-share">
                <h3>Share this Article</h3>
                <div className="share-buttons">
                    <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn"
                        title="Share on X"
                    >
                        <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn"
                        title="Share on LinkedIn"
                    >
                        <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.981 0 1.778-.773 1.778-1.729V1.729C24 .774 23.206 0 22.225 0z" /></svg>
                    </a>
                    <a
                        href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn whatsapp"
                        title="Share on WhatsApp"
                    >
                        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </a>
                    <button
                        onClick={handleCopyLink}
                        className="share-btn copy"
                        title="Copy Link"
                    >
                        <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <Link to="/" className="btn btn-secondary">
                    ← Back to All Articles
                </Link>
            </div>

            {/* Toast Notification */}
            <div className={`share-toast ${showToast ? 'show' : ''}`}>
                Link copied to clipboard!
            </div>
        </article>
    );
}

export default Article;
