const destinations = [
    { id: "kyoto", name: "Kyoto", region: "Asia", duration: "5 days", summary: "Shrines, bamboo paths, and traditional tea culture." },
    { id: "amalfi", name: "Amalfi Coast", region: "Europe", duration: "6 days", summary: "Coastal cliffs, pastel villages, and seaside dining." },
    { id: "jaipur", name: "Jaipur", region: "Asia", duration: "4 days", summary: "Forts, palaces, vibrant bazaars, and desert heritage." },
    { id: "lisbon", name: "Lisbon", region: "Europe", duration: "4 days", summary: "Hilltop viewpoints, historic trams, and Atlantic breezes." }
];

let activeRegion = "All";
let searchQuery = "";
const savedIds = new Set(JSON.parse(localStorage.getItem("roamlySaved") || "[]"));

const grid = document.getElementById("destinationsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const savedCount = document.getElementById("savedCount");

function updateSavedCounter() {
    savedCount.textContent = `Saved: ${savedIds.size}`;
    localStorage.setItem("roamlySaved", JSON.stringify([...savedIds]));
}

function render() {
    const matches = destinations.filter((item) => {
        const regionOk = activeRegion === "All" || item.region === activeRegion;
        const text = `${item.name} ${item.region} ${item.summary}`.toLowerCase();
        const searchOk = text.includes(searchQuery);
        return regionOk && searchOk;
    });

    if (!matches.length) {
        grid.innerHTML = "<p>No destinations match your current filter.</p>";
        return;
    }

    grid.innerHTML = matches
        .map((item) => {
            const isSaved = savedIds.has(item.id);
            return `
        <article class="card">
          <div>
            <span class="tag">${item.region} · ${item.duration}</span>
            <h2 style="margin-top: 0.6rem;">${item.name}</h2>
            <p style="margin-top: 0.35rem; color: #475569;">${item.summary}</p>
          </div>
          <button class="save-btn ${isSaved ? "saved" : ""}" data-id="${item.id}">
            ${isSaved ? "Saved ✓" : "Save Trip"}
          </button>
        </article>
      `;
        })
        .join("");
}

searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    render();
});

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeRegion = btn.dataset.region;
        render();
    });
});

grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".save-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    if (savedIds.has(id)) {
        savedIds.delete(id);
    } else {
        savedIds.add(id);
    }
    updateSavedCounter();
    render();
});

updateSavedCounter();
render();