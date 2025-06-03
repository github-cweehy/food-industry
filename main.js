const searchButton = document.querySelector("nav .cuisine-nav .link-search");
const closeButton = document.querySelector(".search-container .link-close");
const cuisineNav = document.querySelector(".cuisine-nav");
const searchContainer = document.querySelector(".search-container");
const overlay = document.querySelector(".overlay");
const loaderContainer = document.querySelector('.loader-container');
const pageContent = document.querySelector('#page-content');

// Search toggle
searchButton?.addEventListener("click", () => {
    cuisineNav?.classList.add("hide");
    searchContainer?.classList.remove("hide");
    overlay?.classList.add("show");
});

closeButton?.addEventListener("click", () => {
    cuisineNav?.classList.remove("hide");
    searchContainer?.classList.add("hide");
    overlay?.classList.remove("show");
});

overlay?.addEventListener("click", () => {
    cuisineNav?.classList.remove("hide");
    searchContainer?.classList.add("hide");
    overlay?.classList.remove("show");
});

// Loader
window.addEventListener('load', () => {
    loaderContainer?.classList.add('hidden');
    pageContent?.classList.add('visible');
});

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);
const FOODO = $rdf.Namespace("http://purl.org/foodontology#");
const EX = $rdf.Namespace("http://example.org/recipe#");

document.querySelector("form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const keyword = e.target.querySelector("input").value.toLowerCase();
    await fetchRDFData();
    searchRecipes(keyword);
});

async function fetchRDFData() {
    try {
        await fetcher.load("recipes.ttl");
        console.log("RDF Loaded");
    } catch (err) {
        console.error("Failed to load RDF:", err);
    }
}

function searchRecipes(keyword) {
    const matches = store.match(null, FOODO("hasCuisine"));
    const resultContainer = document.createElement("div");
    resultContainer.innerHTML = "<h3>Results:</h3>";

    matches.forEach(match => {
        const cuisine = match.object.value.toLowerCase();
        const recipe = match.subject.value.split("#")[1];
        if (cuisine.includes(keyword)) {
            const el = document.createElement("p");
            el.textContent = `🍽 ${recipe} (${match.object.value})`;
            resultContainer.appendChild(el);
        }
    });

    const oldResults = document.querySelector(".search-results");
    if (oldResults) oldResults.remove();
    resultContainer.classList.add("search-results");

    const quickLinks = document.querySelector(".quick-links");
    quickLinks.innerHTML = "<h2>Results</h2><ul></ul>";

    matches.forEach(match => {
        const cuisine = match.object.value.toLowerCase();
        const recipe = match.subject.value.split("#")[1];
        if (cuisine.includes(keyword)) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = `🍽 ${recipe} (${match.object.value})`;
            li.appendChild(a);
            quickLinks.querySelector("ul").appendChild(li);
        }
    });
}

