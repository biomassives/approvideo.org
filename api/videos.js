import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Get the user's token from the request headers
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' })
  }

  // Initialize Supabase client with the user's token
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          panels (*)
        `)
      if (error) throw error
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { panels, ...videoData } = req.body

      // Insert the video data
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .insert([videoData])
        .single()

      if (videoError) throw videoError

      // If panels exist, insert them with the new video_id
      if (panels && panels.length > 0) {
        const panelsWithVideoId = panels.map(panel => ({
          ...panel,
          video_id: video.id
        }))

        const { error: panelsError } = await supabase
          .from('panels')
          .insert(panelsWithVideoId)

        if (panelsError) throw panelsError
      }

      res.status(200).json(video)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
