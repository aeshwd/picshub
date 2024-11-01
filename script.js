// Select DOM elements for image wrapper, load more button, and search input
const imageWrapper = document.querySelector(".images");
const loadMore = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-bar input");

// API key and pagination settings
const apiKey = "xH3AQqU5MSKOZ60D9jhUIZu2KxeONBeFw5TTwS9GU1mBj4E2nnZTPnD2"; // Pexels API key
const perPage = 15; // Number of images to load per page
let currentPage = 1; // Starting page number
let searchTerm = ""; // Variable to store search term for image search

// Function to generate HTML for each image and display it in the image wrapper
const generateHTML = (images) => {
    // Map over images and create HTML for each one, including the download button
    imageWrapper.innerHTML += images.map(img => 
        `<li class="card">
            <img src="${img.src.large2x}" alt="Image">
            <a href="${img.src.large2x}" download class="download-btn">
                <i class="fas fa-download"></i> Download
            </a>
        </li>`
    ).join(""); // Join all HTML strings together

    // Add click event to each image to toggle download button visibility
    document.querySelectorAll('.card img').forEach(image => {
        image.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            card.classList.toggle('show-download'); // Toggle 'show-download' class
        });
    });
}

// Function to fetch images from Pexels API and call generateHTML to display them
const getImages = (apiURL) => {
    loadMore.innerText = "Loading...";
    loadMore.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey } // Set authorization header with API key
    })
    .then(res => res.json()) // Parse JSON response
    .then(data => {
        generateHTML(data.photos); // Pass fetched images to generateHTML function
        loadMore.innerText = "Load More";
        loadMore.classList.remove("disabled");
    });
}

// Function to load more images based on the current search term or curated images
const loadMoreImages = () => {
    currentPage++; // Move to the next page
    let apiURL;

    // Check if there is a search term to determine the API URL
    if (searchTerm) {
        apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
    } else {
        apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    }

    getImages(apiURL); // Fetch and display the next set of images
}

// Function to load search results based on user input in the search bar
const loadSearchImages = (e) => {
    if (e.key === "Enter") { // Check if 'Enter' key was pressed
        currentPage = 1; // Reset to first page for new search
        searchTerm = e.target.value; // Store the search term
        imageWrapper.innerHTML = ""; // Clear previous images
        // Fetch images based on search term
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

// Initial load: fetch and display curated images when the page loads
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// Event listeners
loadMore.addEventListener("click", loadMoreImages); // Load more images on button click
searchInput.addEventListener("keyup", loadSearchImages); // Trigger search when 'Enter' is pressed in search bar
