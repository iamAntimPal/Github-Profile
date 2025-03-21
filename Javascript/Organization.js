document.addEventListener("DOMContentLoaded", async () => {
    const orgUsername = "Optimism-Educators"; // GitHub Organization Username
    const apiUrl = `https://api.github.com/orgs/${orgUsername}`;

    try {
        const response = await fetch(apiUrl);
        const orgData = await response.json();

        // Update organization details dynamically
        document.getElementById("org-logo").src = orgData.avatar_url;
        document.getElementById("org-name").textContent = orgData.name || "Optimism Educators";
        document.getElementById("org-description").textContent = orgData.description || "Empowering learners with top-notch education.";
        document.getElementById("org-link").href = orgData.html_url;
    } catch (error) {
        console.error("Error fetching organization data:", error);
        document.getElementById("org-description").textContent = "Failed to load data.";
    }
});
