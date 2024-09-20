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


    const videoId = id;

    // Update categories
    if (categories) {
      // Delete existing relationships
      const { error: deleteVcError } = await trx
        .from('video_categories')
        .delete()
        .eq('video_id', videoId);

      if (deleteVcError) throw deleteVcError;

      // Insert new relationships (same as in createVideo)
      for (const categoryName of categories) {
        // Same logic as in createVideo...
        // (Omitted for brevity)
      }
    }

    // Update tags
    if (tags) {
      // Delete existing relationships
      const { error: deleteVtError } = await trx
        .from('video_tags')
        .delete()
        .eq('video_id', videoId);

      if (deleteVtError) throw deleteVtError;

      // Insert new relationships (same as in createVideo)
      for (const tagName of tags) {
        // Same logic as in createVideo...
        // (Omitted for brevity)
      }
    }

    // Update panels
    if (panels) {
      // Delete existing panels
      const { error: deletePanelsError } = await trx
        .from('panels')
        .delete()
        .eq('video_id', videoId);

      if (deletePanelsError) throw deletePanelsError;

      // Insert new panels
      for (const panel of panels) {
        // Same logic as in createVideo...
        // (Omitted for brevity)
      }
    }

    // Update materials
    if (materials) {
      // Delete existing materials
      const { error: deleteMaterialsError } = await trx
        .from('materials')
        .delete()
        .eq('video_id', videoId);

      if (deleteMaterialsError) throw deleteMaterialsError;

      // Insert new materials
      for (const material of materials) {
        // Same logic as in createVideo...
        // (Omitted for brevity)
      }
    }

    // Update steps
    if (steps) {
      // Delete existing steps
      const { error: deleteStepsError } = await trx
        .from('steps')
        .delete()
        .eq('video_id', videoId);

      if (deleteStepsError) throw deleteStepsError;

      // Insert new steps
      let stepNumber = 1;
      for (const stepDescription of steps) {
        // Same logic as in createVideo...
        // (Omitted for brevity)
        stepNumber++;
      }
    }

    return videoData;
  });

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
    steps
  } = videoData;

  // Call the updated stored procedure
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
    video_steps: steps
  });

  if (error) throw error;
  return data;
}

