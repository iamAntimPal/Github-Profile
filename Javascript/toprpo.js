/* Dynamic Repos Script with Authentication and Debugging */

document.addEventListener("DOMContentLoaded", async () => {
      const username = "iamAntimPal";
      const repoContainer = document.getElementById("repos-container");
      const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // Replace with your GitHub personal access token

      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
          headers: {
            Authorization: `token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const repos = await response.json();
        console.log("Fetched Repositories:", repos); // Debugging log

        // Filter out forked repos (optional) and sort by sum of stars and forks
        const originalRepos = repos.filter(repo => !repo.fork);
        originalRepos.sort((a, b) => {
          return (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count);
        });

        // Take top 4 repos
        const topRepos = originalRepos.slice(0, 4);
        topRepos.forEach(repo => {
          const card = document.createElement("div");
          card.classList.add("repo-card");
          card.innerHTML = `
            <h3 class="repo-name">
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p class="repo-description">${repo.description || "No description available."}</p>
            <p class="repo-stats">
              ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
            </p>
          `;
          repoContainer.appendChild(card);
        });
      } catch (error) {
        console.error("Error fetching repositories:", error);
        repoContainer.innerHTML = "<p>Failed to load repositories.</p>";
      }
    });