import fs from 'fs';
import { request } from '@octokit/request';
import fetch from 'node-fetch';

// Retrieve the GitHub token from the environment variable
const GH_TOKEN = process.env.GH_TOKEN;

async function getIssues() {
  try {
    const response = await request('GET /repos/{owner}/{repo}/issues', {
      headers: {
        authorization: `token ${GH_TOKEN}`
      },
      owner: 'LuciooF', // Replace with your GitHub username
      repo: 'Tourney2024Scripts', // Replace with your repository name
      state: 'all',
      request: {
        fetch: fetch
      }
    });

    return response.data.map(issue => {
      const checked = issue.state === 'closed' ? 'x' : ' ';
      return `- [${checked}] [${issue.title}](${issue.html_url})`;
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return []; // Return an empty array if there's an error
  }
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
  console.error('Error updating README:', error);
  process.exit(1);
});
