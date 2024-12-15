/* Builds groupy-redis container.
i.e if there already exists an image for groupy-redis then do nothing, else create one */

import { exec } from "node:child_process";

const containerName = "groupy-redis";

exec(`docker stop ${containerName}`, (err, stdout, stderr) => {
  if (
    stderr.trim() ===
    `Error response from daemon: No such container: ${containerName}`
  ) {
    console.log(`Error: Cannot find container ${containerName}`);
    return;
  }

  if (err) {
    console.error("Error checking Docker images:", err);
    return;
  }

  if (stdout.trim() === containerName) {
    console.log(`${containerName} stopped succesfully`);
  }

  // Remove container
  exec(`docker rm ${containerName}`, (err, stdout, stderr) => {
    if (
      stderr.trim() ===
      `Error response from daemon: No such container: ${containerName}`
    ) {
      console.log(`No such container found to remove: ${containerName}`);
    }

    if (err) {
      console.error(`Error occured while removing ${containerName}`);
      return;
    }

    if (stdout.trim() === containerName) {
      console.log(`${containerName} removed succesfully`);
    }
  });
});
