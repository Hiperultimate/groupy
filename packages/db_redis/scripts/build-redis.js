/* Builds groupy-redis container.
i.e if there already exists an image for groupy-redis then do nothing, else create one */

import { exec } from "node:child_process";

const imageName = "groupy.redis";

exec(
  `docker images --filter "reference=${imageName}" --format "{{.Repository}}"`,
  (err, stdout) => {
    if (err) {
      console.error("Error checking Docker images:", err);
      return;
    }

    if (stdout.trim() === imageName) {
      console.log(
        `${imageName} image already exists. \nIf you want to re-build the groupy/redis image run the command "npm run redis-build" in packages/db_redis`
      );
    } else {
      console.log("Trying to build redis image...");
      exec(`npm run redis-build`, (err, stdout) => {
        if (err) {
          console.error(
            `Error occured while creating an image of : ${imageName} \n ${err}`
          );
        }
        console.log("Redis container running, ID :", stdout.trim());
      });
    }
  }
);
