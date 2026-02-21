import { supabase } from '../supabase';

/*
  Required Supabase Storage bucket: "images"

  Create in Supabase Dashboard → Storage → New Bucket
  - Name: images
  - Public: true (so images can be displayed via public URL)
*/

export async function uploadImage(file, folder = 'images') {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `${folder}/${timestamp}_${safeName}`;

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

export async function deleteImage(imageUrl) {
    try {
        // Extract path from the public URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/storage/v1/object/public/images/');
        if (pathParts.length > 1) {
            const filePath = decodeURIComponent(pathParts[1]);
            await supabase.storage.from('images').remove([filePath]);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
