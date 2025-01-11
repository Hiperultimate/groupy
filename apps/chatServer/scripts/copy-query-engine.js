// This script copies over prisma query engine from node_modules/prisma. Query engine is created after prisma generate

const fs = require("fs");
const path = require("path");

const prismaDir = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'prisma',);
const files = fs.readdirSync(prismaDir);
const nodeFile = files.find((file) => file.endsWith(".node"));

// If a .node file is found, store its full path
if (nodeFile) {
  const sourceFile = path.join(prismaDir, nodeFile);
  const queryEngineFileName = path.basename(nodeFile);
  const destinationDir = path.join(__dirname, "..", "build");
  const destinationFile = path.join(destinationDir, queryEngineFileName);

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  // Copy the file
  fs.copyFile(sourceFile, destinationFile, (err) => {
    if (err) {
      console.error("chatServer/scripts/copy-query-engine Error copying file:", err);
    } else {
      console.log(`Prisma query file successfully copied to ${destinationFile}`);
    }
  });
} else {
  console.error("No prisma query_engine node file was found in the @/node_modules/prisma directory");
}
