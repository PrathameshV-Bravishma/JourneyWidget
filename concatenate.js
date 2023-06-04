const fs = require("fs-extra");
const concat = require("concat");

(async function build() {
  const files = [
    "./dist/journey-widget/runtime.js",
    "./dist/journey-widget/polyfills.js",
    "./dist/journey-widget/main.js",
    "./dist/journey-widget/scripts.js",
  ];
  // "./dist/journey-widget/styles.css",

  // await fs.ensureDir("elements");
  await fs.ensureDir("./dist/journey-widget/elements");
  await concat(
    files,
    "./dist/journey-widget/elements/angular-widget-journey-auth.js"
  );

  await fs.copyFile(
    "./dist/journey-widget/styles.css",
    "./dist/journey-widget/elements/styles.css"
  );
})();

// test for old widget

// const fs = require("fs-extra");
// const concat = require("concat");

// (async function build() {
//   const files = [
//     "./dist/journey-widget/runtime.js",
//     "./dist/journey-widget/polyfills.js",
//     "./dist/journey-widget/main.js",
//     "./dist/journey-widget/scripts.js",
//   ];

//   // await fs.ensureDir("elements");
//   await fs.ensureDir("./dist/journey-widget/elements");
//   await concat(
//     files,
//     "./dist/journey-widget/elements/angular-widget-userdetails-exchangerate.js"
//   );

//   await fs.copyFile(
//     "./dist/journey-widget/styles.css",
//     "./dist/journey-widget/elements/styles.css"
//   );
// })();
