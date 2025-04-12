document.addEventListener("DOMContentLoaded", async () => {
  const username = "iamAntimPal";
  const repoContainer = document.getElementById("repos-container");
  try {
    // Fetch all repositories from GitHub for the given username
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    let repos = await response.json();

    // Filter out forked repos
    const originalRepos = repos.filter(repo => !repo.fork);

    // Enrich each repository with open PR count and open issues count (excluding PRs)
    const enrichedRepos = await Promise.all(originalRepos.map(async repo => {
      // Fetch open pull requests for this repository
      let prCount = 0;
      try {
        const prResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/pulls?state=open`);
        const prData = await prResponse.json();
        if (Array.isArray(prData)) {
          prCount = prData.length;
        }
      } catch (error) {
        console.error(`Error fetching PRs for ${repo.name}:`, error);
      }

      // Fetch open issues (excluding pull requests) using the search API
      let issueCount = 0;
      try {
        const issuesResponse = await fetch(`https://api.github.com/search/issues?q=repo:${username}/${repo.name}+type:issue+state:open`);
        const issuesData = await issuesResponse.json();
        if (issuesData.total_count !== undefined) {
          issueCount = issuesData.total_count;
        }
      } catch (error) {
        console.error(`Error fetching issues for ${repo.name}:`, error);
      }

      // Save counts on the repo object and calculate a combined score
      repo.pr_count = prCount;
      repo.issue_count = issueCount;
      repo.score = repo.stargazers_count + repo.forks_count + repo.issue_count + repo.pr_count;
      return repo;
    }));

    // Sort repositories in descending order by score (highest first)
    enrichedRepos.sort((a, b) => b.score - a.score);

    // Take top 6 repositories
    const topRepos = enrichedRepos.slice(0, 6);
    topRepos.forEach(repo => {
      const card = document.createElement("div");
      card.classList.add("repo-card");
      card.innerHTML = `
        <h3 class="repo-name">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </h3>
        <p class="repo-description">${repo.description || "No description available."}</p>
        <p class="repo-stats">
          ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | ❗ ${repo.issue_count} | 🔀 ${repo.pr_count}
        </p>
      `;
      repoContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    repoContainer.innerHTML = "<p>Failed to load repositories.</p>";
  }
});