const fs = require("fs");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");

const css = fs.readFileSync("src/app/globals.css", "utf8");
postcss([tailwind])
  .process(css, { from: "src/app/globals.css" })
  .then((res) => {
    fs.writeFileSync("src/app/globals-compiled.css", res.css);
    console.log("Compiled globals-compiled.css successfully (" + res.css.length + " bytes)");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
