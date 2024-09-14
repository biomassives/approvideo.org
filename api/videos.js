import { getVideoById, getAllVideos } from '../services/videoService';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.id) {
        const video = await getVideoById(req.query.id);
        res.status(200).json(video);
      } else {
        const videos = await getAllVideos();
        res.status(200).json(videos);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/videos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
