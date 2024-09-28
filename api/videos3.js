const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the user's token from the request headers
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }

  // Initialize Supabase client with the user's token
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  switch (req.method) {
    case 'GET':
      await getVideos(supabase, res);
      break;
    case 'POST':
      await createVideo(supabase, req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

async function getVideos(supabase, res) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        panels (*)
      `);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}

async function createVideo(supabase, req, res) {
  try {
    const { panels, ...videoData } = JSON.parse(req.body);
    // Validate video data
    if (!videoData.title || !videoData.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Insert the video data
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert([videoData])
      .single();
    if (videoError) throw videoError;

    // If panels exist, insert them with the new video_id
    if (panels && Array.isArray(panels) && panels.length > 0) {
      const panelsWithVideoId = panels.map(panel => ({
        ...panel,
        video_id: video.id
      }));
      const { error: panelsError } = await supabase
        .from('panels')
        .insert(panelsWithVideoId);
      if (panelsError) throw panelsError;
    }

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
}
