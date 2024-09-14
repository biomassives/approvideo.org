import { getVideoTagById, getAllVideoTags } from '../services/videoTagService';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.id) {
        const videoTag = await getVideoTagById(req.query.id);
        res.status(200).json(videoTag);
      } else {
        const videoTags = await getAllVideoTags();
        res.status(200).json(videoTags);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/video-tags:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
