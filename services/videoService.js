import videoData from '../data/videoData';

export async function getAllVideos() {
  return videoData;
}

export async function getVideoById(id) {
  const video = videoData.find((v) => v.id === id);
  if (!video) {
    throw new Error(`Video with ID ${id} not found`);
  }
  return video;
}

export async function createVideo(videoData) {
  // Implement logic to create a new video
  const newVideo = { id: generateUniqueId(), ...videoData };
  videoData.push(newVideo);
  return newVideo;
}

export async function updateVideo(id, updatedVideoData) {
  const videoIndex = videoData.findIndex((v) => v.id === id);
  if (videoIndex === -1) {
    throw new Error(`Video with ID ${id} not found`);
  }
  const updatedVideo = { ...videoData[videoIndex], ...updatedVideoData };
  videoData[videoIndex] = updatedVideo;
  return updatedVideo;
}

export async function deleteVideo(id) {
  const videoIndex = videoData.findIndex((v) => v.id === id);
  if (videoIndex === -1) {
    throw new Error(`Video with ID ${id} not found`);
  }
  const deletedVideo = videoData.splice(videoIndex, 1)[0];
  return deletedVideo;
}

function generateUniqueId() {
  // Implement a function to generate a unique ID for a new video
  return `new-video-${Date.now()}`;
}
