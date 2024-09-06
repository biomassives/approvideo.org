document.addEventListener('DOMContentLoaded', () => {
  const mainCategories = document.querySelectorAll('.group > a');
  const mondrianBox = document.getElementById('mondrian-box');
  const subcategoryLinks = document.getElementById('subcategory-links');
  const searchInput = document.getElementById('search');
  let currentCategory = null;

  function showSubcategories(category) {
    const dropUpMenu = category.nextElementSibling;
    const subcategories = dropUpMenu.querySelectorAll('.drop-up-item');
    
    subcategoryLinks.innerHTML = '';
    subcategories.forEach((subcategory, index) => {
      const link = document.createElement('a');
      link.href = subcategory.href;
      link.textContent = subcategory.textContent;
      link.className = `p-4 m-2 text-center flex items-center justify-center transition-all duration-300 ease-in-out
                        ${getRandomColor()} ${getRandomSize()}`;
      link.style.minWidth = '100px';
      link.setAttribute('data-category', category.getAttribute('data-category'));
      
      subcategoryLinks.appendChild(link);
    });
    mondrianBox.classList.remove('hidden');
  }

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
      
      // Clear the search input when a category is clicked
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Update the URL to reflect the category selection
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('category', category.getAttribute('data-category'));
      urlParams.delete('tag'); // Remove any existing tag parameter
      history.pushState(null, '', `?${urlParams.toString()}`);
      
      // Trigger the search
      if (typeof filterAndSortVideos === 'function') {
        filterAndSortVideos();
      } else {
        console.error('filterAndSortVideos function not found');
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
      urlParams.set('tag', searchTerm);
      urlParams.set('category', '');
      history.pushState(null, '', `?${urlParams.toString()}`);

      // Close the Mondrian box after selection
      mondrianBox.classList.add('hidden');
      currentCategory = null;

      console.log(`Searching for subcategory: ${searchTerm} in category: ${category}`);
    }
  });
});
