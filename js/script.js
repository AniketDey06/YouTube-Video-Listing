// Selecting the container where videos will be displayed
const videoBox = document.querySelector('.videobox');

// Selecting the search input field
const search = document.querySelector('.input');

// Array to store video data and corresponding DOM elements
let videoDataArr = [];

// formates the time in a youtube like formate
function timeAgo(publishedAt) {
    const publishedDate = new Date(publishedAt); // Convert timestamp to Date object
    const currentDate = new Date(); // Get current date & time
    const diffInSeconds = Math.floor((currentDate - publishedDate) / 1000); // Difference in seconds

    // Define time intervals in seconds
    const intervals = {
        year: 31536000,  // 365 days
        month: 2592000,  // 30 days
        week: 604800,    // 7 days
        day: 86400,      // 24 hours
        hour: 3600,      // 60 minutes
        minute: 60,      // 60 seconds
        second: 1
    };

    // Loop through each interval and determine the correct format
    for (let key in intervals) {
        const time = Math.floor(diffInSeconds / intervals[key]);
        if (time >= 1) {
            return time === 1 ? `1 ${key} ago` : `${time} ${key}s ago`;
        }
    }
    return "Just now"; // If the video was just published
}

// formate the date in a youtube like formate
function getViews(views) {
    // Check the number of views and format it accordingly
    if (views < 1000) {
        // If the view count is less than 1,000, display the exact number
        return views;
    } else if (views > 1000 && views < 100000) {
        // If the view count is between 1,000 and 100,000, convert to 'k' format with one decimal place as youTube shows 
        // *Note - to try this feacture set the api limit to 100 and you have to run localy or through dev tools
        return views = (views / 1000).toFixed(1) + "K";
    } else {
        // If the view count is greater than or equal to 100,000, convert to 'k' format with no decimal places as youTube shows 
        // *Note - to try this feacture set the api limit to 100 and you have to run localy or through dev tools
        return views = (views / 1000).toFixed(0) + "K";
    }
}

// Function to display fetched video data on the screen
function displayToScreen(obj) {
    const videoData = obj.data.data; // Extracting video data from API response
    videoDataArr = []; // Reset the array to avoid duplicates

    videoData.forEach(video => {
        // Creating a card element for each video
        const videoCard = document.createElement("div");
        videoCard.classList.add('card');

        // Constructing the HTML content for the video card
        videoCard.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.items.id}" id="videolink" target="_blank" rel="noopener noreferrer">
                <div class="card-image-container">
                    <img src="${video.items.snippet.thumbnails.maxres.url}" id="thamnail" alt="">
                </div>
                <p class="card-title" id="videotitle">${video.items.snippet.title}</p>
                <div class="channelname">
                    <p class="card-des" id="channelname">
                        ${video.items.snippet.channelTitle}
                    </p>
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <div class="channelname channelstats">

                    <p class="card-des" id="channelname">
                        ${getViews(video.items.statistics.viewCount)}
                    </p>
                    <div class="dot"></div>
                    <p class="card-des" id="channelname">
                        ${timeAgo(video.items.snippet.publishedAt)}
                    </p>
                </div>
            </a>`;

        // Appending the created video card to the container
        videoBox.appendChild(videoCard);

        // Storing video title (in lowercase for case-insensitive search) and the associated DOM element
        videoDataArr.push({
            videoTitle: video.items.snippet.title.toLowerCase(),
            element: videoCard
        });
    });
}

// Function to fetch video data from the API
async function fetchVideoData() {
    fetch("https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=100&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest")
        .then(res => res.json()) // Converting response to JSON format
        .then(displayToScreen) // Passing data to display function
        .catch(error => console.log('Error:', error)) // checking for any errors occurrence 
        .finally(() => console.log("end")) // Logging when API call completes
}

// Event listener for search functionality
search.addEventListener('input', e => {
    const value = e.target.value.toLowerCase(); // Get input value and convert to lowercase

    // Loop through the stored video data array to filter results
    videoDataArr.forEach(video => {
        let isPresent = video.videoTitle.includes(value); // Check if search term matches video title
        video.element.classList.toggle("hide", !isPresent); // Show/hide video cards based on search input
    });
});

// Fetch video data when the page loads
window.addEventListener("load", () => {
    fetchVideoData();
});
