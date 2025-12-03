const fs = require("fs");
const archiver = require("archiver");

if (!fs.existsSync("build")) {
  fs.mkdirSync("build");
}

const output = fs.createWriteStream("build/server-build.zip");
const archive = archiver("zip");

output.on("close", () => {
  console.log("Created build/server-build.zip");
});

archive.pipe(output);

const items = ["app", "app.js", "env", "public", "package.json", "README.md"];
items.forEach(item => {
  if (fs.existsSync(item)) {
    archive.file(item, { name: item });
  }
});

archive.finalize();
