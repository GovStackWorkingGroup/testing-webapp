import syncGitBookBBRequirements from "../cronJobs/syncGitBookBBRequirements";
import { createConnection } from '../db/connection';
import { appConfig } from "../config";

async function main() {
    createConnection(appConfig).connectToMongo();

    await syncGitBookBBRequirements();
}

main().then(() => {});
