import syncGitBookBBRequirements from "../cronJobs/syncGitBookBBRequirements";

async function main() {
  await syncGitBookBBRequirements();
}

main().then(() => {});
