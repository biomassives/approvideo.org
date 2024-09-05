document.addEventListener('DOMContentLoaded', () => {
  const mainCategories = document.querySelectorAll('.group > a');
  const mondrianBox = document.getElementById('mondrian-box');
  const subcategoryLinks = document.getElementById('subcategory-links');
  let currentCategory = null;

  // Add this new code for category buttons
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const category = button.querySelector('span').textContent.trim();
      
      // Update the URL to reflect the selected category
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('category', category);
      history.pushState(null, '', `?${urlParams.toString()}`);

      // Trigger the search for this category
      if (typeof filterAndSortVideos === 'function') {
        filterAndSortVideos();
      } else {
        console.error('filterAndSortVideos function not found');
      }

      console.log(`Selected category: ${category}`);
    });
  });


  
  function getRandomColor() {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getRandomSize() {
    const sizes = ['w-1/4', 'w-1/3', 'w-1/2'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  mainCategories.forEach(category => {
    category.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === category) {
        mondrianBox.classList.add('hidden');
        currentCategory = null;
      } else {
        showSubcategories(category);
        currentCategory = category;
      }
    });
  });

  // Close Mondrian box when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.group') && !e.target.closest('#mondrian-box')) {
      mondrianBox.classList.add('hidden');
      currentCategory = null;
    }
  });

  // Handle subcategory clicks
  subcategoryLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const category = e.target.getAttribute('data-category');
      const searchTerm = e.target.textContent.trim();
      
      // Update the search input with the selected subcategory
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.value = searchTerm;
      }

      // Trigger the search
      if (typeof filterAndSortVideos === 'function') {
        filterAndSortVideos();
      } else {
        console.error('filterAndSortVideos function not found');
      }

      // Update the URL to reflect the search
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('category', searchTerm);
      history.pushState(null, '', `?${urlParams.toString()}`);

      // Close the Mondrian box after selection
      mondrianBox.classList.add('hidden');
      currentCategory = null;

      console.log(`Searching for subcategory: ${searchTerm} in category: ${category}`);
    }
  });
});
