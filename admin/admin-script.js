

// Placeholder video data (replace with actual data fetched from backend)
const pendingVideos = [
  { 
    title: "Solar Power for Beginners", 
    submitter: "SunnyUser123",
    thumbnail: "solar-power.jpg", // Add thumbnail URLs
    description: "A beginner's guide to harnessing solar energy." 
  },
  { 
    title: "Upcycled Fashion Hacks", 
    submitter: "EcoChic",
    thumbnail: "upcycled-fashion.jpg",
    description: "Creative ways to repurpose old clothes."
  },
  // ... more videos
];

const users = [
  { username: "GreenThumbGuru", email: "guru@ecoops.com", isAdmin: true },
  { username: "RecycleQueen", email: "queen@ecoops.com", isAdmin: false },
  // ...
];

// ... (displayUsers function remains the same)

// Enhanced function to display pending videos with thumbnails and descriptions
function displayPendingVideos() {
  const pendingVideosContainer = document.getElementById('pending-videos');
  pendingVideosContainer.innerHTML = ''; 

  pendingVideos.forEach(video => {
    const videoItem = `
      <div class="bg-gray-700 p-4 rounded-lg">
        <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-40 object-cover mb-2 rounded-md">
        <h3 class="text-lg font-semibold">${video.title}</h3>
        <p class="text-sm text-gray-400 mb-2">Submitted by: ${video.submitter}</p>
        <p class="text-sm text-gray-300">${video.description}</p>
        <div class="mt-4 flex justify-end">
          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Approve</button>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Reject</button>
        </div>
      </div>
    `;
    pendingVideosContainer.innerHTML += videoItem;
  });
}


// Function to display users
function displayUsers() {
  const userListContainer = document.getElementById('user-list');
  userListContainer.innerHTML = ''; 

  users.forEach(user => {
    const userItem = `
      <div class="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold">${user.username}</h3>
          <p class="text-sm text-gray-400">${user.email}</p>
        </div>
        <div>
          <span class="px-2 py-1 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-800'}">${user.isAdmin ? 'Admin' : 'User'}</span>
        </div>
      </div>
    `;
    userListContainer.innerHTML += userItem;
  });
}

// Call the display functions on page load
displayPendingVideos();
displayUsers();
