import { getVideoCategoryById, getAllVideoCategories } from '../services/videoCategoryService';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.id) {
        const videoCategory = await getVideoCategoryById(req.query.id);
        res.status(200).json(videoCategory);
      } else {
        const videoCategories = await getAllVideoCategories();
        res.status(200).json(videoCategories);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/video-categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
