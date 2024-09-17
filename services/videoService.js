// services/videoService.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function getAllVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
  if (error) throw error
  return data
}

export async function getVideoById(id) {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      video_categories (category),
      video_tags (tag),
      panels (*)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createVideo(videoData) {
  const { title, description, categories, tags, panels, materials, steps } = videoData

  // Start a Supabase transaction
  const { data, error } = await supabase.rpc('create_video_with_relations', {
    video_title: title,
    video_description: description,
    video_categories: categories,
    video_tags: tags,
    video_panels: panels,
    video_materials: materials,
    video_steps: steps
  })

  if (error) throw error
  return data
}

export async function updateVideo(id, updatedVideoData) {
  const { data, error } = await supabase
    .from('videos')
    .update(updatedVideoData)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function deleteVideo(id) {
  const { data, error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
