import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
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
