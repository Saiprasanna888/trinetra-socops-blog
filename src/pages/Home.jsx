import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import samplePosts from '../data/samplePosts';
import { getPosts } from '../services/posts';
import { isSupabaseConfigured } from '../supabase';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            if (!isSupabaseConfigured) {
                setPosts(samplePosts);
                setLoading(false);
                return;
            }

            try {
                const supabasePosts = await getPosts('published');
                if (supabasePosts.length > 0) {
                    setPosts(supabasePosts);
                } else {
                    setPosts(samplePosts);
                }
            } catch {
                console.log('Using sample data');
                setPosts(samplePosts);
            } finally {

                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <HeroSection />

            <main className="container" style={{ paddingBottom: '60px' }}>
                <div className="layout-with-sidebar">
                    <div>
                        <div className="section-header">
                            <h2>Latest Articles</h2>
                            <div className="accent-line"></div>
                        </div>
                        <div className="grid-posts">
                            {posts.map((post, index) => (
                                <PostCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                        {posts.length === 0 && (
                            <div className="empty-state">
                                <h3>No articles published yet</h3>
                                <p>Check back soon for new cybersecurity insights.</p>
                            </div>
                        )}
                    </div>

                    <Sidebar posts={posts} />
                </div>
            </main>
        </>
    );
}

export default Home;
