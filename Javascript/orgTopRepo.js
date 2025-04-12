// Organization Top Repositories Script with Authentication and Pagination Handling

async function fetchOrganizationTopRepos() {
  const orgName = "Optimism-Educators";
  const orgRepoContainer = document.getElementById("org-repos-container");
  const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // Replace with your GitHub personal access token

  try {
    // Fetch organization repositories
    const response = await fetch(`https://api.github.com/orgs/${orgName}/repos?per_page=100`, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();

    // Filter out forked repos and sort by stars, forks, commits, and pull requests
    const originalRepos = repos.filter(repo => !repo.fork);

    // Fetch additional data (commits and pull requests) for each repo
    const repoDataPromises = originalRepos.map(async (repo) => {
      const commitsCount = await fetchAllPages(repo.commits_url.replace("{/sha}", ""), token);
      const pullsCount = await fetchAllPages(repo.pulls_url.replace("{/number}", ""), token);

      return {
        ...repo,
        commits_count: commitsCount,
        pulls_count: pullsCount
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

// Helper function to fetch all pages of a paginated API endpoint
async function fetchAllPages(url, token) {
  let page = 1;
  let totalCount = 0;

  while (url) {
    const response = await fetch(`${url}?page=${page}&per_page=100`, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}: ${response.status} ${response.statusText}`);
      break;
    }

    const data = await response.json();
    totalCount += data.length;

    // Check if there are more pages
    if (data.length < 100) {
      break;
    }

    page++;
  }

  return totalCount;
}

// Call the function on DOMContentLoaded
document.addEventListener("DOMContentLoaded", fetchOrganizationTopRepos);

// Helper function to fetch all pages of a paginated API endpoint