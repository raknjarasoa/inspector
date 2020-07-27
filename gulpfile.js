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
const purgecss = require("gulp-purgecss");

const paths = {
  html: [
    { url: "src/app/popup/*.html", dir: "app/popup" },
    { url: "src/inject/index.html", dir: "inject" },
  ],
  dist: "dist",
  assets: [
    { url: "src/manifest.json", dir: "." },
    { url: "src/assets/images/*.*", dir: "assets/images" },
    {
      url: "node_modules/tippy.js/dist/tippy.css",
      dir: "assets/css",
    },
    {
      url: "node_modules/tippy.js/themes/light-border.css",
      dir: "assets/css",
    },
  ],
  typescript: [
    { url: "src/background.ts", dir: "." },
    { url: "src/content_script.ts", dir: "." },
    { url: "src/inject/index.ts", dir: "inject" },
    { url: "src/shared/constants.ts", dir: "shared" },
    { url: "src/app/popup/index.ts", dir: "app/popup" },
  ],
  css: [
    {
      url: "src/app/styles/*.css",
      dir: "app/styles",
    },
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

gulp.task("css", async () => {
  const tasks = () => {
    paths.css.map((entry) => {
      return gulp
        .src(entry.url)
        .pipe(
          purgecss({
            content: paths.html.map((v) => v.url)
          })
        )
        .pipe(
          rename({
            dirname: entry.dir,
          })
        )
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

gulp.task(
  "build",
  gulp.series(
    "clean-dist",
    gulp.parallel("copy-assets", "copy-html", "ts", "css")
  )
);

gulp.task("watch", function () {
  gulp.watch("src/**/*.*", gulp.series("build"));
});

gulp.task("default", gulp.series("build", "watch"));
