const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
const eventStream = require("event-stream");
const rename = require("gulp-rename");
var buffer = require("vinyl-buffer");
var sourcemaps = require("gulp-sourcemaps");

const paths = {
  pages: ["src/*.html"],
  dist: "dist",
  assets: ["src/manifest.json"],
  files: [
    "src/background.ts",
    "src/content-script.ts",
    "src/popup.ts",
    "src/in-app.ts",
    "src/ng-check.ts",
    "src/constants.ts"
  ],
};

gulp.task("clean-dist", () => {
  return gulp.src(paths.dist, { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("copy-assets", () => {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.dist));
});

gulp.task("copy-pages", () => {
  return gulp.src(paths.pages).pipe(gulp.dest(paths.dist));
});

gulp.task("ts", async () => {
  const tasks = paths.files.map((entry) => {
    return browserify({
      basedir: ".",
      debug: true,
      entries: [entry],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify)
      .bundle()
      .pipe(source(entry))
      .pipe(
        rename({
          dirname: ".",
          extname: ".js",
        })
      )
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
  });
  return eventStream.merge.apply(null, tasks);
});

gulp.task(
  "main",
  gulp.series("clean-dist", gulp.parallel("copy-assets", "copy-pages", "ts"))
);

gulp.task("watch", function () {
  gulp.watch("src/**/*.*", gulp.series("main"));
});

gulp.task("default", gulp.series("main", "watch"));
