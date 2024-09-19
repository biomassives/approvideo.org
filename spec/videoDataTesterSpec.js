describe("Video Data Tests", function() {
  let statsContainer;

  beforeAll(function() {
    // Create a container for our stats and charts
    statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    document.body.appendChild(statsContainer);
    
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(script);
    
    // Wait for Chart.js to load
    waitsFor(function() {
      return window.Chart !== undefined;
    }, "Chart.js to load", 5000);

    // Mock videoData if it's not available in the test environment
    window.videoData = window.videoData || [
      {
        id: "1",
        title: "Test Video",
        description: "A test video description",
        categories: ["Test", "Video"],
        youtubeId: "testId123",
        rating: 4.5,
        date: "2024-09-18",
        panels: [{ title: "Test Panel", content: "Test content" }],
        materials: ["Test material"],
        steps: ["Test step"],
        additionalInfo: ["Test additional info"]
      }
    ];
  });

  describe("Video Data Tester", function() {
    beforeEach(function() {
      // Create a fixture for the HTML
      document.body.innerHTML = `
        <select id="videoSelect"></select>
        <div id="videoInfo"></div>
        <div id="tabContent"></div>
      `;
      
      // Run the script to set up event listeners
      const script = document.createElement('script');
      script.textContent = document.querySelector('script:not([src])').textContent;
      document.body.appendChild(script);
    });

    it("should populate the video select", function() {
      const options = document.querySelectorAll('#videoSelect option');
      expect(options.length).toBe(1);
      expect(options[0].value).toBe("1");
      expect(options[0].textContent).toBe("Test Video");
    });

    it("should display video info", function() {
      const videoInfo = document.getElementById('videoInfo');
      expect(videoInfo.textContent).toContain("Test Video");
      expect(videoInfo.textContent).toContain("A test video description");
      expect(videoInfo.textContent).toContain("Test");
      expect(videoInfo.textContent).toContain("Video");
      expect(videoInfo.textContent).toContain("testId123");
      expect(videoInfo.textContent).toContain("4.5");
      expect(videoInfo.textContent).toContain("2024-09-18");
    });

    it("should display panel content by default", function() {
      const tabContent = document.getElementById('tabContent');
      expect(tabContent.textContent).toContain("Test Panel");
      expect(tabContent.textContent).toContain("Test content");
    });

    it("should change tab content when clicking tab buttons", function() {
      const materialsTab = document.createElement('button');
      materialsTab.id = 'materialsTab';
      document.body.appendChild(materialsTab);
      materialsTab.click();
      const tabContent = document.getElementById('tabContent');
      expect(tabContent.textContent).toContain("Test material");
    });
  });

  describe("Video Data Statistics Report", function() {
    it("should generate basic statistics", function() {
      const totalVideos = videoData.length;
      const avgRating = videoData.reduce((sum, video) => sum + video.rating, 0) / totalVideos;
      const categories = [...new Set(videoData.flatMap(video => video.categories))];
      
      statsContainer.innerHTML += `
        <h2>Basic Statistics</h2>
        <p>Total Videos: ${totalVideos}</p>
        <p>Average Rating: ${avgRating.toFixed(2)}</p>
        <p>Number of Categories: ${categories.length}</p>
      `;
      
      expect(totalVideos).toBeGreaterThan(0);
      expect(avgRating).toBeGreaterThan(0);
      expect(categories.length).toBeGreaterThan(0);
    });
    
    it("should generate a category distribution chart", function() {
      const categoryCount = {};
      videoData.forEach(video => {
        video.categories.forEach(category => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      });
      
      const canvas = document.createElement('canvas');
      canvas.id = 'category-chart';
      statsContainer.appendChild(canvas);
      
      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: Object.keys(categoryCount),
          datasets: [{
            label: 'Videos per Category',
            data: Object.values(categoryCount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Videos'
              }
            }
          }
        }
      });
      
      expect(Object.keys(categoryCount).length).toBeGreaterThan(0);
    });
    
    it("should generate a rating distribution chart", function() {
      const ratingCount = {};
      videoData.forEach(video => {
        const roundedRating = Math.round(video.rating * 2) / 2; // Round to nearest 0.5
        ratingCount[roundedRating] = (ratingCount[roundedRating] || 0) + 1;
      });
      
      const canvas = document.createElement('canvas');
      canvas.id = 'rating-chart';
      statsContainer.appendChild(canvas);
      
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: Object.keys(ratingCount).sort(),
          datasets: [{
            label: 'Rating Distribution',
            data: Object.keys(ratingCount).sort().map(key => ratingCount[key]),
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Videos'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Rating'
              }
            }
          }
        }
      });
      
      expect(Object.keys(ratingCount).length).toBeGreaterThan(0);
    });
  });
});
