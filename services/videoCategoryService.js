import videoData from '../data/videoData';

export async function getAllVideoCategories() {
  const categories = new Set();
  videoData.forEach((video) => {
    video.categories.forEach((category) => {
      categories.add(category);
    });
  });
  return Array.from(categories).map((category) => ({
    id: category,
    name: category,
  }));
}

export async function getVideoCategoryById(id) {
  const categories = await getAllVideoCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) {
    throw new Error(`Video category with ID ${id} not found`);
  }
  return category;
}

export async function createVideoCategory(categoryName) {
  const existingCategories = await getAllVideoCategories();
  const categoryExists = existingCategories.some((c) => c.name === categoryName);
  if (categoryExists) {
    throw new Error(`Video category "${categoryName}" already exists`);
  }
  const newCategory = { id: categoryName, name: categoryName };
  existingCategories.push(newCategory);
  return newCategory;
}

export async function updateVideoCategory(id, updatedCategoryName) {
  const categories = await getAllVideoCategories();
  const categoryIndex = categories.findIndex((c) => c.id === id);
  if (categoryIndex === -1) {
    throw new Error(`Video category with ID ${id} not found`);
  }
  const updatedCategory = { id: updatedCategoryName, name: updatedCategoryName };
  categories[categoryIndex] = updatedCategory;
  return updatedCategory;
}

export async function deleteVideoCategory(id) {
  const categories = await getAllVideoCategories();
  const categoryIndex = categories.findIndex((c) => c.id === id);
  if (categoryIndex === -1) {
    throw new Error(`Video category with ID ${id} not found`);
  }
  const deletedCategory = categories.splice(categoryIndex, 1)[0];
  return deletedCategory;
}
