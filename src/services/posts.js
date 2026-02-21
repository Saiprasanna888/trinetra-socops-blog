import { supabase } from '../supabase';

/*
  Required Supabase table: "posts"
  
  SQL to create it in Supabase SQL Editor:
  ─────────────────────────────────────────
  CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'Trinetra SOCops',
    status TEXT DEFAULT 'draft',
    featured_image TEXT DEFAULT '',
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  -- Enable Row Level Security
  ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

  -- Public read access for published posts
  CREATE POLICY "Public can read published posts"
    ON posts FOR SELECT
    USING (status = 'published');

  -- Authenticated users can do everything
  CREATE POLICY "Authenticated users full access"
    ON posts FOR ALL
    USING (auth.role() = 'authenticated');
*/

export async function createPost(postData) {
    const { data, error } = await supabase
        .from('posts')
        .insert([{
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            category: postData.category,
            tags: postData.tags || [],
            author: postData.author,
            status: postData.status || 'draft',
            featured_image: postData.featuredImage || '',
            views: 0
        }])
        .select()
        .single();

    if (error) throw error;
    return data.id;
}

export async function updatePost(id, postData) {
    const { error } = await supabase
        .from('posts')
        .update({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            category: postData.category,
            tags: postData.tags || [],
            author: postData.author,
            status: postData.status,
            featured_image: postData.featuredImage || '',
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) throw error;
}

export async function deletePost(id) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function getPost(id) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return normalizePost(data);
}

export async function getPosts(statusFilter = 'published') {
    let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizePost);
}

export async function getPostsByCategory(category) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizePost);
}

export async function getPostsByTag(tag) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .contains('tags', [tag])
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizePost);
}

export async function getPopularPosts(count = 5) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(count);

    if (error) throw error;
    return (data || []).map(normalizePost);
}

export async function getRecentPosts(count = 5) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(count);

    if (error) throw error;
    return (data || []).map(normalizePost);
}

export async function incrementViews(id) {
    const { data } = await supabase
        .from('posts')
        .select('views')
        .eq('id', id)
        .single();

    if (data) {
        await supabase
            .from('posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
    }
}

export async function searchPosts(searchTerm) {
    // Use Postgres ilike for server-side search
    const term = `%${searchTerm}%`;
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.${term},excerpt.ilike.${term},category.ilike.${term}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizePost);
}

// Normalize Supabase row to match the shape the UI expects
function normalizePost(row) {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        tags: row.tags || [],
        author: row.author,
        status: row.status,
        featuredImage: row.featured_image || '',
        views: row.views || 0,
        createdAt: row.created_at ? { seconds: Math.floor(new Date(row.created_at).getTime() / 1000) } : null,
        updatedAt: row.updated_at ? { seconds: Math.floor(new Date(row.updated_at).getTime() / 1000) } : null
    };
}
