describe("Video Data Tester", function() {
    beforeEach(function() {
        // Create a fixture for the HTML
        document.body.innerHTML = `
            <select id="videoSelect"></select>
            <div id="videoInfo"></div>
            <div id="tabContent"></div>
        `;
        
        // Mock videoData if it's not available in the test environment
        window.videoData = [
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
        const materialsTab = document.getElementById('materialsTab');
        materialsTab.click();
        const tabContent = document.getElementById('tabContent');
        expect(tabContent.textContent).toContain("Test material");
    });
});
