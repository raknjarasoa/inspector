const gulp = require("gulp");
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const eventStream = require("event-stream");
const rename = require("gulp-rename");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
sass.compiler = require("node-sass");

const paths = {
  scss: [{ url: "src/styles/index.scss", dir: "styles" }],
  html: [{ url: "src/popup.html", dir: "." }],
  dist: "dist",
  assets: [
    { url: "src/manifest.json", dir: "." },
    { url: "src/assets/images/*.*", dir: "assets/images" },
    {
      url: "src/assets/css/*.css",
      dir: "assets/css",
    },
    {
      url: "src/inject/html-generators/templates/tooltip.ejs",
      dir: "assets/templates",
    },
  ],
  typescript: [
    { url: "src/background.ts", dir: "." },
    { url: "src/content_script.ts", dir: "." },
    { url: "src/inject/index.ts", dir: "inject" },
    { url: "src/constants.ts", dir: "." },
  ],
};

gulp.task("clean-dist", () => {
  return gulp.src(paths.dist, { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("copy-assets", async () => {
  const tasks = () => {
    paths.assets.map((entry) => {
      return gulp
        .src(entry.url)
        .pipe(rename({ dirname: entry.dir }))
        .pipe(gulp.dest(paths.dist));
    });
  };
  return eventStream.merge.apply(null, tasks());
});

gulp.task("copy-html", async () => {
  const tasks = () => {
    paths.html.map((entry) => {
      return gulp
        .src(entry.url)
        .pipe(rename({ dirname: entry.dir }))
        .pipe(gulp.dest(paths.dist));
    });
  };
  return eventStream.merge.apply(null, tasks());
});

gulp.task("ts", async () => {
  const tasks = () =>
    paths.typescript.map((entry) => {
      return browserify({
        basedir: ".",
        debug: true,
        entries: [entry.url],
        cache: {},
        packageCache: {},
      })
        .plugin(tsify)
        .bundle()
        .pipe(source(entry.url))
        .pipe(
          rename({
            dirname: entry.dir,
            extname: ".js",
          })
        )
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
    });
  return eventStream.merge.apply(null, tasks());
});

gulp.task("sass", async function () {
  const tasks = () =>
    paths.scss.map((entry) => {
      return gulp
        .src(entry.url)
        .pipe(sass().on("error", sass.logError))
        .pipe(
          rename({
            dirname: entry.dir,
          })
        )
        .pipe(gulp.dest("dist"));
    });

  return eventStream.merge.apply(null, tasks());
});

gulp.task(
  "build",
  gulp.series(
    "clean-dist",
    gulp.parallel("copy-assets", "copy-html", "ts", "sass")
  )
);

gulp.task("watch", function () {
  gulp.watch("src/**/*.*", gulp.series("build"));
});

gulp.task("default", gulp.series("build", "watch"));
