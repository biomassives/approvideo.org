import { getVideoById, getAllVideos, createVideo, updateVideo, deleteVideo } from '../../services/videoService';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const video = await getVideoById(req.query.id);
          res.status(200).json(video);
        } else {
          const videos = await getAllVideos();
          res.status(200).json(videos);
        }
        break;
      case 'POST':
        const newVideo = await createVideo(req.body);
        res.status(201).json(newVideo);
        break;
      case 'PUT':
        if (!req.query.id) {
          res.status(400).json({ message: 'Video ID is required' });
          return;
        }
        const updatedVideo = await updateVideo(req.query.id, req.body);
        res.status(200).json(updatedVideo);
        break;
      case 'DELETE':
        if (!req.query.id) {
          res.status(400).json({ message: 'Video ID is required' });
          return;
        }
        const deletedVideo = await deleteVideo(req.query.id);
        res.status(200).json(deletedVideo);
        break;
      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/videos:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
