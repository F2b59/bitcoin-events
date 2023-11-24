//   Consts and Helper function definitions   //

let url = "/all_data.json";
let initView = {
    "lat": 49.436,
    "lng": 11.050,
    "zoom": 5
}


// fetch events
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error (`HTTP error: ${response.status}`);
    }

    // yeah, that part is kinda pointless if you fetch directly in Json and not Yaml
    const jsonData = await response.json();
    return jsonData;
}


//   Map   //

function setupLeaflet() {
    // Create a map instance and set the initial view coordinates and zoom level
    map = L.map('map').setView([initView.lat, initView.lng], initView.zoom); // no "var" or "let" means the variable has global scope

    L.tileLayer(`/tileserver-gl/styles/bright/{z}/{x}/{y}.png`, {
        attribution: "\u003ca href=\"https://openmaptiles.org\" target=\"_blank\"\u003e\u0026copy; OpenMapTiles\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e"
    }).addTo(map);
}

function addEventToMap(event) {
    let marker = L.marker([event.lat, event.lng]).addTo(map);
    marker.bindPopup(mapEventDescription(event));
}

function mapEventDescription(event) {
    let desc = `<p class="map-event-name"><a href=${event.url} target="_blank">${event.name}</a></p>`;
    if (event.description) {
        desc += `<p class="map-event-desc">${event.description}</p>`;
    }
    desc += `<p class="map-event-dates">Dates: ${event.dates[0]} - ${event.dates[1]}</p>`;
    desc += `<p class="map-event-place">Location: ${event.address}</p>`;
    if (event.organizer) {
        desc += `<p class="map-event-orga">Organized by ${event.organizer}</p>`;
    }
    return desc;
}


//   Timeline   //

function addEventToTimeline(event) {
    let eventDiv = document.createElement("div");                  // <div
    eventDiv.classList.add("timeline-event");                      //      class="timeline-event">    

    let title = document.createElement("h4");                      //     <h4
    title.classList.add("tl-event-name");                          //         class="tl-event-name">
    titleText = `${event.name}`;                                   //
    let link = document.createElement("a");                        //         <a
    link.href = event.url; 
    link.target = "_blank";                                        //            href="...">
    link.appendChild(document.createTextNode(titleText));          //                        eventName
    title.appendChild(link);
    eventDiv.appendChild(title);

    if (event.description) {
        let description = document.createElement("p");
        description.classList.add("tl-event-desc");
        description.innerHTML = event.description;
        eventDiv.appendChild(description);
    }

    let dates = document.createElement("p");
    dates.classList.add("tl-event-dates");
    dates.innerHTML = `Dates: ${event.dates[0]} - ${event.dates[1]}`;
    eventDiv.appendChild(dates);
    
    let place = document.createElement("p");
    place.classList.add("tl-event-place");
    place.innerHTML = `Location: ${event.address}`;
    eventDiv.appendChild(place);

    if (event.organizer) {
        let organizer = document.createElement("p");
        organizer.classList.add("tm-event-orga");
        organizer.innerHTML = `Organized by ${event.organizer}`;
        eventDiv.appendChild(organizer);
    }

    let parentElement = document.getElementById("timeline");
    parentElement.appendChild(eventDiv);
}

function selectEvents(eventData) { // keep between 3 and 10 elements, if possible in the next month
    let selection = [];

    eventData.sort((a, b) => new Date(a.dates[0]) - new Date(b.dates[0])); // sort by starting date

    i_start = 0;
    while (new Date(eventData[i_start].dates[0]) < new Date()) {
        i_start++;
    }

    let k = 0;
    let now = new Date().getTime();
    let oneMonthFromNow = new Date().setMonth(new Date().getMonth() + 1);
    
    // Preferably events in the next month.
    // Except if there are less than 3 or more than 10 events.
    while (k < 10 && eventData.length - i_start - k > 0) {                                      
        if (k >= 3 && (new Date(eventData[i_start + k].dates[0]).getTime() > oneMonthFromNow)) {
            return selection;
        }

        selection.push(eventData[i_start + k]);
        k++;
    }

    return selection;    
}


//   Main   //

async function main() {
    setupLeaflet();
    
    // add points to map
    let eventData = await fetchJson(url);
    for (let i = 0; i < eventData.length; i++) {
        addEventToMap(eventData[i]);
    }

    // add events to Coming events section
    let selection = selectEvents(eventData);
    for (let i = 0; i < selection.length; i++) {
        addEventToTimeline(selection[i])
    }

}

if (document.readyState !== 'loading') {
    console.log('Document is ready. Running main()...');
    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('Document was not ready, wait before running main()...');
        main();
    });
}

