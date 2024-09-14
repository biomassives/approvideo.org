import videoData from '../data/videoData';

export async function getAllVideoTags() {
  const tags = new Set();
  videoData.forEach((video) => {
    video.tags.forEach((tag) => {
      tags.add(tag);
    });
  });
  return Array.from(tags).map((tag) => ({
    id: tag,
    name: tag,
  }));
}

export async function getVideoTagById(id) {
  const tags = await getAllVideoTags();
  const tag = tags.find((t) => t.id === id);
  if (!tag) {
    throw new Error(`Video tag with ID ${id} not found`);
  }
  return tag;
}

export async function createVideoTag(tagName) {
  const existingTags = await getAllVideoTags();
  const tagExists = existingTags.some((t) => t.name === tagName);
  if (tagExists) {
    throw new Error(`Video tag "${tagName}" already exists`);
  }
  const newTag = { id: tagName, name: tagName };
  existingTags.push(newTag);
  return newTag;
}

export async function updateVideoTag(id, updatedTagName) {
  const tags = await getAllVideoTags();
  const tagIndex = tags.findIndex((t) => t.id === id);
  if (tagIndex === -1) {
    throw new Error(`Video tag with ID ${id} not found`);
  }
  const updatedTag = { id: updatedTagName, name: updatedTagName };
  tags[tagIndex] = updatedTag;
  return updatedTag;
}

export async function deleteVideoTag(id) {
  const tags = await getAllVideoTags();
  const tagIndex = tags.findIndex((t) => t.id === id);
  if (tagIndex === -1) {
    throw new Error(`Video tag with ID ${id} not found`);
  }
  const deletedTag = tags.splice(tagIndex, 1)[0];
  return deletedTag;
}
