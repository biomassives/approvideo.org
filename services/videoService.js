export async function updateVideo(id, updatedVideoData) {
  const {
    title,
    creator,
    description,
    youtubeId,
    rating,
    date,
    transcript,
    views,
    additionalInfo,
    resources,
    categories,
    tags,
    panels,
    materials,
    steps,
  } = updatedVideoData;

  // Call the stored procedure
  const { data, error } = await supabase.rpc('update_video_with_relations', {
    video_id: id,
    video_title: title,
    video_creator: creator,
    video_description: description,
    video_youtube_id: youtubeId,
    video_rating: rating,
    video_date: date,
    video_transcript: transcript,
    video_views: views,
    video_additional_info: additionalInfo,
    video_resources: resources,
    video_categories: categories,
    video_tags: tags,
    video_panels: panels,
    video_materials: materials,
    video_steps: steps,
  });

  if (error) throw error;
  return data;
}


export async function deleteVideo(id) {
  // Deleting the video should automatically delete related entries if ON DELETE CASCADE is set up
  const { data, error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function createVideo(videoData) {
  const {
    title,
    creator,
    description,
    youtubeId,
    rating,
    date,
    transcript,
    views,
    additionalInfo,
    resources,
    categories,
    tags,
    panels,
    materials,
    steps,
  } = videoData;

  // Call the stored procedure
  const { data, error } = await supabase.rpc('create_video_with_relations', {
    video_title: title,
    video_creator: creator,
    video_description: description,
    video_youtube_id: youtubeId,
    video_rating: rating,
    video_date: date,
    video_transcript: transcript,
    video_views: views,
    video_additional_info: additionalInfo,
    video_resources: resources,
    video_categories: categories,
    video_tags: tags,
    video_panels: panels,
    video_materials: materials,
    video_steps: steps,
  });

  if (error) throw error;
  return data;
}
