// Organization Top Repositories Script

async function fetchOrganizationTopRepos() {
  const orgName = "Optimism-Educators";
  const orgRepoContainer = document.getElementById("org-repos-container");

  try {
    // Fetch organization repositories
    const response = await fetch(`https://api.github.com/orgs/${orgName}/repos?per_page=100`);
    const repos = await response.json();

    // Filter out forked repos and sort by stars, forks, commits, and pull requests
    const originalRepos = repos.filter(repo => !repo.fork);

    // Fetch additional data (commits and pull requests) for each repo
    const repoDataPromises = originalRepos.map(async (repo) => {
      const [commitsResponse, pullsResponse] = await Promise.all([
        fetch(repo.commits_url.replace("{/sha}", "")),
        fetch(repo.pulls_url.replace("{/number}", ""))
      ]);

      const commits = await commitsResponse.json();
      const pulls = await pullsResponse.json();

      return {
        ...repo,
        commits_count: commits.length,
        pulls_count: pulls.length
      };
    });

    const enrichedRepos = await Promise.all(repoDataPromises);

    // Sort by stars, forks, commits, and pull requests
    enrichedRepos.sort((a, b) => {
      return (
        (b.stargazers_count + b.forks_count + b.commits_count + b.pulls_count) -
        (a.stargazers_count + a.forks_count + a.commits_count + a.pulls_count)
      );
    });

    // Take top 4 repos
    const topRepos = enrichedRepos.slice(0, 4);

    // Render top repositories
    topRepos.forEach(repo => {
      const card = document.createElement("div");
      card.classList.add("repo-card");
      card.innerHTML = `
        <h3 class="repo-name">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </h3>
        <p class="repo-description">${repo.description || "No description available."}</p>
        <p class="repo-stats">
          ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 📝 ${repo.commits_count} commits | 🔀 ${repo.pulls_count} pull requests
        </p>
      `;
      orgRepoContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching organization repositories:", error);
    orgRepoContainer.innerHTML = "<p>Failed to load organization repositories.</p>";
  }
}

// Call the function on DOMContentLoaded
document.addEventListener("DOMContentLoaded", fetchOrganizationTopRepos);