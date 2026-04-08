
const API_KEY = "60a385fa-7b90-4ab6-bf04-6c7c63a420ba";

const BASE_URL = "https://api.harvardartmuseums.org/object";

// State
let allArtworks = [];
let favorites = JSON.parse(localStorage.getItem('museumFavorites')) || [];

// DOM Elements
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classificationFilter");
const sortOrder = document.getElementById("sortOrder");
const themeToggle = document.getElementById("themeToggle");

// Initialization
async function init() {
  setupTheme();
  await fetchArt();
  setupEventListeners();
}

// Fetch Artworks
async function fetchArt() {
  showLoading();

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&size=12`
    );

    const data = await response.json();

    displayArt(data.records);

  } catch (error) {
    document.getElementById("gallery").innerHTML =
      "<p>Error loading artworks. Please try again.</p>";
  }
}

// Apply Search, Filter, and Sort
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const classification = classFilter.value;
  const sortType = sortOrder.value;

  const filtered = allArtworks
    .filter(item => {
      const matchesSearch = (item.title?.toLowerCase().includes(searchTerm)) ||
        (item.dated?.toLowerCase().includes(searchTerm)) ||
        (item.creators?.[0]?.displayname?.toLowerCase().includes(searchTerm));

      const matchesClass = classification === "all" || item.classification === classification;

      return matchesSearch && matchesClass;
    })
    .sort((a, b) => {
      if (sortType === "title-asc") return (a.title || "").localeCompare(b.title || "");
      if (sortType === "title-desc") return (b.title || "").localeCompare(a.title || "");
      if (sortType === "date-new") return (b.accessionyear || 0) - (a.accessionyear || 0);
      if (sortType === "date-old") return (a.accessionyear || 0) - (b.accessionyear || 0);
      return 0;
    });

  renderGallery(filtered);
}

// Render Gallery
function renderGallery(artworks) {
  gallery.innerHTML = "";

  if (artworks.length === 0) {
    gallery.innerHTML = `<div class="loading-indicator">No masterpieces found matching your criteria.</div>`;
    return;
  }

  artworks.forEach(item => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
            <img src="${item.primaryimageurl}" alt="${item.title}" loading="lazy">
            <div class="card-content">
                <div>
                    <h3>${item.title || "Untitled"}</h3>
                    <p>${item.dated || "Unknown Date"}</p>
                    <p style="font-size: 0.75rem; margin-top: 0.25rem;">${item.classification || "Unclassified"}</p>
                </div>
                <div class="meta">
                    <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${item.id}" title="Favorite">
                        ${isFav ? '♥' : '♡'}
                    </button>
                    <span style="font-size: 0.7rem; color: var(--text-secondary)">#${item.objectnumber}</span>
                </div>
            </div>
        `;

    // Favorite Button Logic
    const favBtn = card.querySelector(".btn-fav");
    favBtn.addEventListener("click", () => toggleFavorite(item.id, favBtn));

    gallery.appendChild(card);
  });
}

fetchArt();