//To run this just do node update-readme.mjs in the terminal
//All this does is look a the GH issues (If you were to have the .env file with the GH_TOKEN) and then update the README.md file with the issues
//Just did it for funsies.
import fs from 'fs';
import { request } from '@octokit/request';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const GH_TOKEN = process.env.GH_TOKEN;

async function getIssues() {
  try {
    const response = await request('GET /repos/{owner}/{repo}/issues', {
      headers: {
        authorization: `token ${GH_TOKEN}`
      },
      owner: 'LuciooF',
      repo: 'Tourney2024Scripts',
      state: 'all',
      sort: 'created',
      direction: 'asc',
      request: {
        fetch: fetch
      }
    });

    return response.data.map(issue => ({
      number: issue.number,
      state: issue.state,
      title: issue.title,
      url: issue.html_url
    }));
  } catch (error) {
    console.error('Error fetching issues:', error);
    return []; // Return an empty array if there's an error
  }
}

async function updateReadme() {
  const readmePath = 'README.md';
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  const issues = await getIssues();

  // Separate the issues into closed and open
  const closedIssues = issues.filter(issue => issue.state === 'closed');
  const openIssues = issues.filter(issue => issue.state === 'open');

  // Format the issues for the README
  const formatIssue = issue => `- [${issue.state === 'closed' ? 'x' : ' '}] [${issue.title}](${issue.url}){${issue.number}} `;
  const issuesList = [...closedIssues, ...openIssues].map(formatIssue);

  // Create the new README content
  const issueListStart = readmeContent.indexOf('## Issues');
  const updatedReadmeContent = `${readmeContent.slice(0, issueListStart + '## Issues'.length)}
\n${issuesList.join('\n')}`;

  fs.writeFileSync(readmePath, updatedReadmeContent, 'utf-8');
}

updateReadme().catch(error => {
  console.error('Error updating README:', error);
  process.exit(1);
});
