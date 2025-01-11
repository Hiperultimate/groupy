// This script copies over prisma query engine from node_modules/prisma. Query engine is created after prisma generate

const fs = require("fs");
const path = require("path");

const schemaFileName = "schema.prisma";
const sourceFile = path.join(__dirname, "..", "..","..", "packages", "db_prisma", "prisma", schemaFileName);
const destinationDir = path.join(__dirname, "..", "build");
const destinationFile = path.join(destinationDir, schemaFileName);

// Create destination directory if it doesn't exist
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

// Copy the file
fs.copyFile(sourceFile, destinationFile, (err) => {
  if (err) {
    console.error("Error copying file :: trace from > apps/chatServer/scripts/copy-schema-prisma :", err);
  } else {
    console.log(`Prisma schema file successfully copied to ${destinationFile}`);
  }
});