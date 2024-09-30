// Mock auction data
const auctions = [
  {
    id: 1,
    name: 'Scrap Metal Lot',
    description: 'Various metal pieces available for recycling.',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    name: 'Old Electronics Bundle',
    description: 'Broken computers and mobile devices.',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    name: 'Plastic Bottles Collection',
    description: 'Cleaned and sorted plastic bottles ready for repurposing.',
    image: 'https://via.placeholder.com/300',
  },
];

// Function to display auctions
const displayAuctions = () => {
  const auctionList = document.getElementById('auction-list');
  auctions.forEach(auction => {
    const auctionItem = document.createElement('div');
    auctionItem.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-4', 'hover:bg-yellow-100', 'transition', 'duration-300');
    auctionItem.innerHTML = `
      <img src="${auction.image}" alt="${auction.name}" class="h-48 w-full object-cover mb-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-2 text-green-700">${auction.name}</h3>
      <p class="text-gray-700 text-sm mb-4">${auction.description}</p>
      <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Place Bid
      </button>
    `;
    auctionList.appendChild(auctionItem);
  });
};

// Event listener for form submission
document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const itemName = document.getElementById('itemName').value;
  const itemDescription = document.getElementById('itemDescription').value;
  const itemImage = document.getElementById('itemImage').files[0];
  
  // For demo purposes, we just log the item data
  console.log({
    itemName,
    itemDescription,
    itemImage
  });
  
  alert('Item uploaded successfully!');
});

// Initialize auctions display
displayAuctions();