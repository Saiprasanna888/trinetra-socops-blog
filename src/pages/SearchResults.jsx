import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import samplePosts from '../data/samplePosts';
import { searchPosts } from '../services/posts';
import { isSupabaseConfigured } from '../supabase';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function doSearch() {
            if (!query.trim()) {
                setPosts([]);
                setLoading(false);
                return;
            }

            const term = query.toLowerCase();
            const filterSample = () =>
                samplePosts.filter(
                    (p) =>
                        p.status === 'published' &&
                        (p.title?.toLowerCase().includes(term) ||
                            p.excerpt?.toLowerCase().includes(term) ||
                            p.tags?.some((t) => t.toLowerCase().includes(term)) ||
                            p.category?.toLowerCase().includes(term))
                );

            if (!isSupabaseConfigured) {
                setPosts(filterSample());
                setLoading(false);
                return;
            }

            try {
                const results = await searchPosts(query);
                if (results.length > 0) {
                    setPosts(results);
                } else {
                    setPosts(filterSample());
                }
            } catch {

                setPosts(filterSample());
            } finally {
                setLoading(false);
            }
        }
        doSearch();
    }, [query]);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="search-page container animate-fade-in">
            <div className="search-header">
                <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '16px', display: 'inline-flex' }}>
                    ← Back
                </Link>
                <h1>
                    Results for "<span>{query}</span>"
                </h1>
                <p className="search-results-count">
                    {posts.length} article{posts.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {posts.length > 0 ? (
                <div className="grid-posts">
                    {posts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No results found</h3>
                    <p>Try different keywords or browse by category.</p>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
