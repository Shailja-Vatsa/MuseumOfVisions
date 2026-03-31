
const MyAPI = "60a385fa-7b90-4ab6-bf04-6c7c63a420ba";

const BaseURL = "https://api.harvardartmuseums.org/object";

async function fetchArt() {
  showLoading();

  try {
    const response = await fetch(
      `${BaseURL}?apikey=${MyAPI}&size=12`
    );

    const data = await response.json();

    displayArt(data.records);

  } catch (error) {
    document.getElementById("gallery").innerHTML =
      "<p>Error loading artworks. Please try again :)</p>";
  }
}


function showLoading() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "<p>Loading artworks...</p>";
}


function displayArt(artworks) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  artworks
    .filter(item => item.primaryimageurl) 
    .map(item => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${item.primaryimageurl}" alt="${item.title}">
        <h3>${item.title || "No Title"}</h3>
        <p>${item.dated || "Unknown Date"}</p>
      `;

      gallery.appendChild(card);
    });
}

fetchArt();
