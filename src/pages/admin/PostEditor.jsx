import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CATEGORIES } from '../../data/samplePosts';
import { createPost, updatePost, getPost } from '../../services/posts';
import { uploadImage } from '../../services/storage';

function PostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('SOC');
    const [tags, setTags] = useState('');
    const [author, setAuthor] = useState('Trinetra SOCops');
    const [status, setStatus] = useState('draft');
    const [featuredImage, setFeaturedImage] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEditing) {
            async function fetchPost() {
                try {
                    const post = await getPost(id);
                    if (post) {
                        setTitle(post.title || '');
                        setExcerpt(post.excerpt || '');
                        setContent(post.content || '');
                        setCategory(post.category || 'SOC');
                        setTags(post.tags?.join(', ') || '');
                        setAuthor(post.author || 'Trinetra SOCops');
                        setStatus(post.status || 'draft');
                        setFeaturedImage(post.featuredImage || '');
                    }
                } catch (error) {
                    setMessage('Error loading post: ' + error.message);
                } finally {
                    setLoading(false);
                }
            }
            fetchPost();
        }
    }, [id, isEditing]);

    const handleFeaturedImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setMessage('Uploading featured image...');
            const url = await uploadImage(file, 'featured');
            setFeaturedImage(url);
            setMessage('Featured image uploaded!');
        } catch (error) {
            setMessage('Upload failed: ' + error.message);
        }
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;
            try {
                const url = await uploadImage(file, 'content');
                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url);
                }
            } catch (error) {
                alert('Image upload failed: ' + error.message);
            }
        };
    };

    const insertYouTubeVideo = () => {
        if (!youtubeUrl.trim()) return;

        let videoId = '';
        const url = youtubeUrl.trim();
        if (url.includes('youtube.com/watch')) {
            videoId = new URL(url).searchParams.get('v');
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }

        if (videoId) {
            const embedHtml = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
            setContent((prev) => prev + embedHtml);
            setYoutubeUrl('');
            setMessage('YouTube video embedded!');
        } else {
            setMessage('Invalid YouTube URL');
        }
    };

    const handleSave = async (publishStatus) => {
        if (!title.trim()) {
            setMessage('Title is required');
            return;
        }

        setSaving(true);
        setMessage('');

        const postData = {
            title: title.trim(),
            excerpt: excerpt.trim(),
            content,
            category,
            tags: tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            author: author.trim() || 'Trinetra SOCops',
            status: publishStatus,
            featuredImage
        };

        try {
            if (isEditing) {
                await updatePost(id, postData);
                setMessage(`Post ${publishStatus === 'published' ? 'published' : 'saved as draft'}!`);
            } else {
                await createPost(postData);

                setMessage(`Post created and ${publishStatus === 'published' ? 'published' : 'saved as draft'}!`);
                setTimeout(() => navigate('/admin'), 1500);
            }
            setStatus(publishStatus);
        } catch (error) {
            setMessage('Error saving: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                [{ color: [] }, { background: [] }],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'blockquote',
        'code-block',
        'link',
        'image',
        'color',
        'background'
    ];

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="editor-page animate-fade-in">
            <div className="admin-topbar">
                <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/admin')}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {message && (
                <div className={`admin-alert ${message.includes('Error') || message.includes('failed') || message.includes('Invalid') ? 'admin-alert-error' : 'admin-alert-success'}`}>
                    {message}
                </div>
            )}

            {/* Title */}
            <div className="form-group">
                <label>Post Title</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Enter a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Excerpt */}
            <div className="form-group">
                <label>Excerpt / Summary</label>
                <textarea
                    className="form-input"
                    placeholder="Brief description of the article..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    style={{ minHeight: '80px' }}
                />
            </div>

            {/* Featured Image */}
            <div className="form-group">
                <label>Featured Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="form-input"
                    style={{ padding: '10px' }}
                />
                {featuredImage && (
                    <img
                        src={featuredImage}
                        alt="Featured"
                        className="featured-image-preview"
                    />
                )}
            </div>

            {/* Content Editor */}
            <div className="form-group">
                <label>Content</label>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your article content here... Use the toolbar for formatting, code blocks, and images."
                />
            </div>

            {/* YouTube Embed */}
            <div className="form-group">
                <label>Embed YouTube Video</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={insertYouTubeVideo}
                    >
                        Embed
                    </button>
                </div>
            </div>

            {/* Meta Fields Row */}
            <div className="editor-meta-grid">

                <div className="form-group">
                    <label>Category</label>
                    <select
                        className="form-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Author</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="SOC, Threat Hunting, MITRE ATT&CK"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            {/* Action Buttons */}
            <div className="editor-actions">
                <button
                    className="btn btn-secondary"
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                >
                    {saving && status === 'draft' ? 'Saving...' : '💾 Save as Draft'}
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => handleSave('published')}
                    disabled={saving}
                >
                    {saving && status === 'published' ? 'Publishing...' : '🚀 Publish'}
                </button>
            </div>
        </div>
    );
}

export default PostEditor;
