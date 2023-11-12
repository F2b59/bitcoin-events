// Consts and Helper function definitions
let url = "/all_data.json";
let initView = {
    "lat": 49.436,
    "lng": 11.050,
    "zoom": 5
}

// fetch events
async function fetchJson(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error (`HTTP error: ${response.status}`);
    }

    // yeah, that part is kinda pointless if you fetch directly in Json and not Yaml
    const jsonData = await response.json();
    return jsonData;
}

function addEventToMap(event) {
    let marker = L.marker([event.lat, event.lng]).addTo(map);
    marker.bindPopup(eventDescription(event));
}

function eventDescription(event) {
    let desc = `<span class=event-name><p><a href=${event.url}>${event.name}</a></p></span>`;
    desc += `<p>${event.description}</p>`;
    desc += `<p>Dates: ${event.dates[0]} - ${event.dates[1]}</p>`;
    desc += `<p>Location: ${event.address}</p>`;
    desc += `<p>Organized by ${event.organizer}</p>`;
    return desc;
}

function setupLeaflet() {
    // Wait for the document to be ready
    document.addEventListener('DOMContentLoaded', function () {
        const key = '1FAlXSwZpDAPrQYh9mvA'; // Maptiler API key
        // Create a map instance and set the initial view coordinates and zoom level
        map = L.map('map').setView([initView.lat, initView.lng], initView.zoom); // no "var" or "let" means the variable has global scope


        // Add a tite layer to the map from OpenStreetMap
        //L.tileLayer(`https://api.maptiler.com/maps/bright-v2/{z}/{x}/{y}.png?key=${key}`, {
        //    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
        //}).addTo(map);
        L.tileLayer(`/tileserver-gl/styles/bright/{z}/{x}/{y}.png`, {
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
        }).addTo(map);

        // Create a TEST marker with popup and add it to the map
        //let marker = L.marker([51.505, -0.09]).addTo(map);
        //marker.bindPopup("Hello, I'm a marker!").openPopup();
    });
}

async function main() {
    setupLeaflet();
    
    const eventData = await fetchJson(url);
    for (let i = 0; i < eventData.length; i++) {
        addEventToMap(eventData[i]);
    }

}

main();
