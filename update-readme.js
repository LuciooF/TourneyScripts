const fs = require('fs');
const { Octokit } = require("@octokit/rest");
const fetch = require('node-fetch');

// Pass the fetch implementation to Octokit
const octokit = new Octokit({ 
  auth: process.env.GH_TOKEN,
  request: {
    fetch: fetch
  }
});

async function getIssues() {
  const issues = await octokit.issues.listForRepo({
    owner: 'LuciooF', // Replace with your GitHub username
    repo: 'Tourney2024Scripts', // Replace with your repository name
    state: 'all'
  });

  return issues.data.map(issue => {
    const checked = issue.state === 'closed' ? 'x' : ' ';
    return `- [${checked}] [${issue.title}](${issue.html_url})`;
  });
}

async function updateReadme() {
  // Read the existing README file
  const readmePath = 'README.md';
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  // Extract the current issues list from the README
  const issueListStart = readmeContent.indexOf('## Issues');
  const issueListEnd = readmeContent.indexOf('\n\n', issueListStart);
  const existingIssueList = readmeContent.slice(issueListStart, issueListEnd).split('\n').slice(2);

  // Get the current issues from GitHub
  const issuesList = await getIssues();

  // Merge the existing issues with the new issues, avoiding duplicates
  const updatedIssues = new Set([...existingIssueList, ...issuesList]);

  // Create the new README content
  const updatedReadmeContent = `${readmeContent.slice(0, issueListStart)}
## Issues

${[...updatedIssues].join('\n')}${readmeContent.slice(issueListEnd)}`;

  // Write the updated content back to the README file
  fs.writeFileSync(readmePath, updatedReadmeContent);
}

updateReadme().catch(error => {
  console.error(error);
  process.exit(1);
});
