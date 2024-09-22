// import gulp from 'gulp';
// import gulpSass from 'gulp-sass';
// import * as sass from 'sass'
// import cleanCSS from 'gulp-clean-css';
// import uglify from 'gulp-uglify';
// import rename from 'gulp-rename';
// import concat from 'gulp-concat';
// import browserSync from 'browser-sync';
// import autoprefixer from 'gulp-autoprefixer';
// import fileInclude from 'gulp-file-include';
// import ghPages from 'gulp-gh-pages';
// import { generate as criticalGenerate } from 'critical';
// import through2 from 'through2';


// // Инициализация browserSync
// const browserSyncInstance = browserSync.create();
// const compileSass = gulpSass(sass);

// // Путь к исходным и выходным файлам
// const paths = {
//     styles: {
//         src: './src/assets/css/**/*.scss',
//         dest: './dist/assets/css'
//     },
//     scripts: {
//         src: './src/assets/js/**/*.js',
//         dest: './dist/assets/js'
//     },
//     favicon: {
//         src: './src/favicon/**/*',
//         dest: './dist/favicon'
//     },
//     html: {
//         src: './src/*.html',
//         dest: './dist'
//     },
//     htmlPages: {
//         src: './src/pages/**/*.html', // Новая папка для страниц
//         dest: './dist/pages' // Путь для скомпилированных страниц
//     },
//     htmlPartials: {
//         src: './src/parts/**/*.html'
//     }
// };


// // Задача для компиляции SCSS в CSS с автопрефиксом и минификацией
// function styles() {
//     return gulp.src(paths.styles.src)
//         .pipe(compileSass().on('error', compileSass.logError))
//         .pipe(autoprefixer({
//             cascade: false
//         }))
//         .pipe(cleanCSS())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(paths.styles.dest))
//         .pipe(browserSyncInstance.stream());
// }

// // Задача для объединения и минификации JS
// function scripts() {
//     return gulp.src(paths.scripts.src)
//         .pipe(concat('all.js'))
//         .pipe(uglify())
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(paths.scripts.dest))
//         .pipe(browserSyncInstance.stream());
// }


// // Задача для копирования фавикона
// function favicon() {
//     return gulp.src(paths.favicon.src)
//         .pipe(gulp.dest(paths.favicon.dest));
// }

// // Задача для сборки HTML с использованием частей
// function html() {
//     return gulp.src(paths.html.src)
//         .pipe(fileInclude({
//             prefix: '@@',
//             basepath: '@file'
//         }))
//         .pipe(gulp.dest(paths.html.dest))
//         .pipe(browserSyncInstance.stream());
// }

// // Задача для сборки HTML страниц
// function htmlPages() {
//     return gulp.src(paths.htmlPages.src)
//         .pipe(fileInclude({
//             prefix: '@@',
//             basepath: [
//                 '@file',
//                 'src/parts' // Add this if your parts are located in src/parts
//             ]
//         }))
//         .pipe(gulp.dest(paths.htmlPages.dest))
//         .pipe(browserSyncInstance.stream());
// }

// // Задача для генерации Critical CSS
// function criticalCSS() {
//     return gulp.src('dist/*.html')
//         .pipe(through2.obj(async function (file, _, cb) {
//             try {
//                 const content = await criticalGenerate({
//                     base: 'dist/',
//                     inline: true,
//                     css: ['dist/assets/css/main.min.css'],
//                     dimensions: [
//                         {
//                             height: 800,
//                             width: 1200,
//                         },
//                     ],
                    
//                     extract: false,
//                     ignore: ['@font-face', /url\(/],
//                     html: file.contents.toString()
//                 });
//                 file.contents = Buffer.from(content.html);
//                 cb(null, file);
//             } catch (err) {
//                 cb(err);
//             }
//         }))
//         .pipe(gulp.dest('dist'));
// }



// // Задача для полной сборки проекта
// const build = gulp.series(
//     gulp.parallel(styles, scripts, favicon, html, htmlPages), // Добавлен htmlPages
//     criticalCSS
// );

// // Задача для деплоя на GitHub Pages
// function deploy() {
//     return gulp.src('./dist/**/*')
//         .pipe(ghPages());
// }

// // Задача для запуска локального сервера с автоматической перезагрузкой
// function serve() {
//     browserSyncInstance.init({
//         server: {
//             baseDir: './dist'
//         }
//     });

//     gulp.watch(paths.styles.src, styles);
//     gulp.watch(paths.scripts.src, gulp.series(scripts));
//     gulp.watch(paths.favicon.src, favicon);
//     gulp.watch(paths.html.src, html);
//     gulp.watch(paths.htmlPartials.src, html);
//     gulp.watch(paths.htmlPages.src, htmlPages); // Добавлен watch для htmlPages
//     gulp.watch('./dist/*.html').on('change', browserSyncInstance.reload);
// }

// export { styles, scripts, favicon, html, htmlPages, criticalCSS, build, deploy };

// export default gulp.series(build, serve);



import { src, dest, watch, series, parallel } from 'gulp';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import fileInclude from 'gulp-file-include';
import terser from 'gulp-terser';
import concat from 'gulp-concat';

import ghPages from 'gh-pages';

const SRC_ASSETS = './src/assets/';
const DIST_ASSETS = './dist/assets/';

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
  });

  watch(SRC_ASSETS + 'css/**/*.scss', buildStyles);
  watch(SRC_ASSETS + 'js/*.js', buildScripts);
  watch(SRC_ASSETS + 'js/pages/*.js', buildPageScripts);
  watch('./src/**/*.html', buildHTML);
  watch('./src/pages/**/*.html', buildPages);  
}

function buildStyles() {
  const sassCompiler = gulpSass(sass);
  
  return src(SRC_ASSETS + 'css/**/*.scss')
    .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      autoprefixer({
        grid: true,
        flex: true,
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(dest(DIST_ASSETS + 'css/'))
    .pipe(browserSync.stream());
}

function buildHTML() {
  return src('src/*.html')
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function buildPages() {
  return src('src/pages/*.html')  
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: 'src'
      })
    )
    .pipe(dest('dist'))  
    .pipe(browserSync.stream());
}

function buildScripts() {
  return src(SRC_ASSETS + 'js/*.js')
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(rename('all.min.js'))
    .pipe(dest(DIST_ASSETS + 'js/'))
    .pipe(browserSync.stream());
}

function buildPageScripts() {
  return src(SRC_ASSETS + 'js/pages/*.js')
    .pipe(terser())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(DIST_ASSETS + 'js/'))
    .pipe(browserSync.stream());
}

// function convertFonts() {
//   return src(SRC_ASSETS + 'fonts/**/*.*')
//     .pipe(ttf2woff2())
//     .pipe(dest(DIST_ASSETS + 'fonts/'));
// }



// function movePlugins() {
//   return src(SRC_ASSETS + 'plugins/**/*').pipe(dest(DIST_ASSETS + 'plugins/'));
// }

function deploy(cb) {
  ghPages.publish('dist', cb);
}

// const move = parallel(movePlugins);

const build = series( parallel(buildHTML, buildPages, buildStyles, buildScripts, buildPageScripts));

export { serve, buildStyles, buildHTML, buildPages, buildScripts, buildPageScripts, build, deploy };

export const dev = series(build, serve);
