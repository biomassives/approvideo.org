---
name: Approvideo Web Video Gallery Starter
slug: vide-html-starter-with-analytics
description: HTML5 template with analytics and advanced routing configuration.
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/html&project-name=html
relatedTemplates:
  - nextjs-boilerplate
  - biomassives
---

# Approvideo

This is a based on a starter HTML5 templates which is configured with Vercel Analytics (through a `script` tag), advanced routing with [Vercel Edge Middleware](https://vercel.com/docs/concepts/functions/edge-middleware), as well as some basic styles

# ApproVideo Project Structure Documentation

ApproVideo System Documentation
Overview
ApproVideo is a web application that showcases appropriate technology videos for the DIY sector. The system allows users to browse, search, and view details of various educational videos categorized by topics such as Drinking Water, Waste Management, Energy Systems, and Health.
Key Components
1. HTML Structure

The main page includes a header, category navigation, search bar, and a grid for displaying video cards.
A modal for displaying detailed video information.

2. Styling

Uses Tailwind CSS for styling.
Implements a light/dark mode toggle.
Custom CSS for specific components like video cards and info panels.

3. JavaScript Functionality

Video data is imported from an external videoData.js file.
Main functions:

renderVideo(): Creates HTML for individual video cards.
renderVideoDetails(): Generates detailed view for a selected video.
filterAndSortVideos(): Handles search and category filtering.
setupEventListeners(): Sets up various event handlers.
setupThemeToggle(): Manages light/dark mode switching.



4. Features

Category filtering
Search functionality
Responsive design
Light/dark mode toggle
Detailed video view with YouTube embed
Star rating system
Additional information panels with navigation

Areas for Potential Enhancement

Implement server-side rendering for better SEO.
Add pagination or infinite scrolling for large numbers of videos.
Implement caching mechanisms for video data.
Enhance accessibility features.
Add user authentication and personalized features.
Implement analytics to track user interactions.

Conclusion
The ApproVideo system provides a solid foundation for showcasing educational DIY videos. It offers good user experience features like search, categorization, and theme switching. With some enhancements, it could be scaled to handle larger video libraries and provide more advanced features for users.

This document provides an overview of the ApproVideo project structure, explaining the purpose of each directory and key files.

## Project Root

- `generate_structure.py`: Python script used to generate the project structure.
- `jest.config.js`: Configuration file for Jest testing framework.
- `next.config.js`: Configuration file for Next.js.
- `package.json`: Node.js project configuration and dependencies.
- `README.md`: Project documentation and setup instructions.

## Source Directory (`src/`)

### Components (`src/components/`)

Contains reusable React components, each in its own directory with a component file and a test file.

- **CategoryFilter**: Handles filtering videos by category.
  - `CategoryFilter.js`
  - `CategoryFilter.test.js`

- **Layout**: Manages the overall layout of the application.
  - `Footer.js`: Footer component.
  - `Header.js`: Header component.
  - `Layout.js`: Main layout wrapper.

- **SearchBar**: Implements the search functionality.
  - `SearchBar.js`
  - `SearchBar.test.js`

- **ThemeToggle**: Manages the light/dark theme toggle.
  - `ThemeToggle.js`
  - `ThemeToggle.test.js`

- **VideoCard**: Displays individual video information in a card format.
  - `VideoCard.js`
  - `VideoCard.test.js`

- **VideoDetail**: Shows detailed information about a selected video.
  - `VideoDetail.js`
  - `VideoDetail.test.js`

### Contexts (`src/contexts/`)

- `ThemeContext.js`: Provides theme context for the application.

### Hooks (`src/hooks/`)

- `useVideos.js`: Custom hook for managing video data and operations.

### Pages (`src/pages/`)

Contains Next.js pages for routing.

- `index.js`: Home page.
- `[category]/[tag]/[title].js`: Dynamic route for individual video pages.

### Public (`src/public/`)

- `images/`: Directory for storing public images.

### Styles (`src/styles/`)

- `globals.css`: Global styles for the application.

### Tests (`src/tests/`)

- `setup.js`: Setup file for Jest tests.

### Utils (`src/utils/`)

Utility functions and helpers.

- `api.js`: API-related utility functions.
- `helpers.js`: General helper functions.

## GitHub Workflows

- `.github/workflows/ci.yml`: Continuous Integration workflow configuration.

## Usage

To start development:

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

To run tests:

```
npm test
```

To build for production:

```
npm run build
```

## Contributing

Please refer to the `README.md` file for contribution guidelines and setup instructions.


We respect your privacy and are committed to protecting your personal information. We only collect the minimum necessary data to provide and improve our services, which includes information like your IP address and browsing activity. We do not sell or share your personal information with third parties without your explicit consent, except as required by law.  

You have the right to access, correct, or delete your personal information at any time. If you have any questions or concerns about our privacy practices, 1  please contact us through the information provided on our website. We will respond to your inquiry as soon as possible.  


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/html&project-name=html)





---  base




<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>ApproVideo Aug 2024</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">

    <style>

        /* ... (keep all the existing styles) ... */


        /* Add the missing sidebar styles here */

        .menu-sidebar {

    position: fixed;

    top: 0;

    left: -300px; /* Initially hidden */

    width: 300px;

    height: 100%;

    background-color: white;

    z-index: 50; /* Ensure it's above other content */

    transition: left 0.3s ease-in-out; /* Smooth transition */

    overflow-y: auto; /* Add scrollbar if content overflows */

    padding: 1rem;

}


body.dark .menu-sidebar {

    background-color: #2d3748;

    color: white;

}


.menu-sidebar.open {

    left: 0; /* Slide in when open */

}


.menu-overlay {

    position: fixed;

    top: 0;

    left: 0;

    width: 100%;

    height: 100%;

    background-color: rgba(0, 0, 0, 0.5);

    z-index: 40; /* Below the sidebar */

    opacity: 0; /* Initially hidden */

    visibility: hidden;

    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

}


body.menu-open .menu-overlay {

    opacity: 1;

    visibility: visible;

}

    </style>

</head>

<body class="light">

    <div class="menu-overlay"></div>

    <div class="menu-sidebar p-4">

        <button id="close-menu" class="mb-4 text-2xl">&times;</button>

        <a href="#" class="block mb-2 hover:underline" onclick="loadPage('about')">About</a>

        <a href="#" class="block mb-2 hover:underline" onclick="loadPage('account')">Account</a>

    </div>

    <div class="flex flex-col min-h-screen">

        <header class="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">

            <div class="container mx-auto flex justify-between items-center">

                <button id="menu-toggle" class="text-2xl">☰</button>

                <h1 class="text-3xl font-bold">ApproVideo</h1>

                <div class="flex items-center">

                    <button id="theme-toggle" class="text-2xl mr-4">

                        <i class="fas fa-sun" id="theme-toggle-light-icon"></i>

                        <i class="fas fa-moon hidden" id="theme-toggle-dark-icon"></i>

                    </button>

                </div>

            </div>

        </header>

        <main class="flex-grow container mx-auto px-4 py-8">

            <div class="mb-4 text-center">

                <div class="subheader">Appropriate Technology Videos for the DIY Sector</div>

            </div>

            <div class="mb-4 flex justify-center space-x-4 category-links">

                </div>

            <div class="mb-4">

                <input type="text" id="search" placeholder="Search videos..." class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">

            </div>

            <div id="categories" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>

            <div id="page-content" class="mt-8 hidden"></div>

        </main>

        <footer class="bg-gray-200 dark:bg-gray-800 p-4 text-center">

            <p>&copy; 2024 ApproVideo. All rights reserved.</p>

        </footer>

    </div>


    <div id="video-detail" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">

        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">

            <div id="video-content"></div>

            <div class="text-center mt-4">

                <button id="close-detail" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">

                    Close

                </button>

            </div>

        </div>

    </div>


    <script>

        const videoData = [

            {

                "id": "1",

                "title": "DIY Gravity-Based Water Filter",

                "categories": ["Drinking Water", "Health"],

                "description": "A simple gravity water filter using easily sourced materials like sand, gravel, and activated charcoal.",

                "youtubeId": "v6O6jFs5DrQ",

                "tags": ["water", "filter", "DIY", "purification"],

                "rating": 4.5,

                "date": "2023-05-15",

                "transcript": "This is a dummy transcript for the DIY Gravity-Based Water Filter video...",

                "materials": ["Sand", "Gravel", "Activated Charcoal", "Large Plastic Containers", "PVC Pipe"],

                "steps": [

                    "Prepare the containers",

                    "Layer the filtering materials",

                    "Set up the water flow system",

                    "Test the filter",

                    "Maintain and clean regularly"

                ]

            },

            // ... (rest of the video data) ...

        ];


        // ... (rest of your existing JavaScript code) ...


        // Add the missing renderCategoryLinks function here

        function renderCategoryLinks(videos) {

    const uniqueCategories = [...new Set(videos.flatMap(video => video.categories))];

    const categoriesContainer = document.querySelector('.category-links');

    categoriesContainer.innerHTML = uniqueCategories.map(category => `

        <a href="#" class="category-link flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" data-category="${category}">

            <i class="fas fa-tint w-6 h-6 text-blue-500"></i>

            <span class="ml-3">${category}</span>

        </a>

    `).join('');


    // Attach event listeners after rendering

    document.querySelectorAll('.category-link').forEach(link => {

        link.addEventListener('click', function(e) {

            e.preventDefault();

            const category = this.getAttribute('data-category');

            history.pushState(null, '', `?category=${category}`);

            filterAndSortVideos();

        });

    });

}


        // Call renderCategoryLinks when the page loads

        renderCategoryLinks(videoData); 


        // ... (rest of your JavaScript code) ...

    </script>

</body>

</html>
