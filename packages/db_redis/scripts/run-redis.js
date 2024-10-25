/* Safely runs groupy-redis container.
i.e if container is running then do nothing else run the container */

import { exec } from "node:child_process";

const containerName = "groupy-redis";

exec(
  `docker ps --filter "name=${containerName}" --format "{{.Names}}"`,
  (err, stdout) => {
    if (err) {
      console.error("Error checking Docker containers:", err);
      return;
    }

    if (stdout.trim() === containerName) {
      console.log(`${containerName} already running`);
    } else {
      // Checking if groupy-redis container already exists
      exec(
        `docker inspect -f '{{.State.Running}}' ${containerName}`,
        (runningContainerError, stdout) => {
          if (runningContainerError) {
            console.log(
              `${containerName} does not exist, trying to create it now...\n`
            );

            console.log(`Creating and running : ${containerName}`);

            // Container does not exist, create it and run it
            exec(`npm run docker-redis`, (err, stdout) => {
              if (err) {
                console.error(
                  `Error creating Redis image : ${containerName} \n ${err}`
                );
              }
              console.log("Redis image now running... ", stdout.trim());
            });
            return;
          }

          if (stdout.trim() === "'false'") {
            // Container exist, simply run it
            console.log("Starting existing image of :", containerName);
            exec("npm run redis-start", (err, stdout) => {
              if (err) {
                console.log(
                  "Something is wrong with the redis image. Try clearing out groupy-redis caches in docker."
                );
                return;
              }

              console.log(`Started redis container :${containerName}`);
              return;
            });
          }
        }
      );
    }
  }
);
