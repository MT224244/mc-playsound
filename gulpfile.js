const { task, src, dest, watch, parallel } = require('gulp');
const electron = require('electron-connect').server.create();
const plumber = require('gulp-plumber');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
const fs = require('fs');

const config = {
    ts: {
        src: 'src/main/**/*.ts',
        dist: 'dist/main'
    },
    pug: {
        src: [ 'src/renderer/pug/**/*.pug', '!src/renderer/pug/**/_*.pug' ],
        dist: 'dist/renderer/html'
    },
    sass: {
        src: 'src/renderer/sass/**/*.{sass,scss}',
        dist: 'dist/renderer/css',
        opt: { outputStyle: 'compressed' }
    },
    webpack: {
        src: 'src/renderer/js',
        dist: 'dist/renderer/js'
    },
    copy: {
        src: 'src/renderer/resource/**/*',
        dist: 'dist/renderer/resource'
    },
    liclist: {
        src: 'dist/renderer/resource/licenses.json'
    }
}

//#region For debug
task('electron-start', done => {
    electron.start();
    watch('dist/main/**/*', done => {
        electron.restart();
        done();
    });
    watch('dist/renderer/**/*', done => {
        electron.reload();
        done();
    });
    done();
});
//#endregion

//#region TypeScript
task('ts', done => {
    src(config.ts.src).pipe(plumber()).pipe(tsProject()).pipe(dest(config.ts.dist));
    done();
});
task('ts-watch', done => {
    watch(config.ts.src, task('ts'));
    done();
});
//#endregion

//#region Pug
task('pug', done => {
    src(config.pug.src).pipe(plumber()).pipe(pug()).pipe(dest(config.pug.dist));
    done();
});
task('pug-watch', done => {
    watch(config.pug.src[0], task('pug'));
    done();
});
//#endregion

//#region Sass
task('sass', done => {
    src(config.sass.src).pipe(plumber()).pipe(sass(config.sass.opt)).pipe(dest(config.sass.dist));
    done();
});
task('sass-watch', done => {
    watch(config.sass.src, task('sass'));
    done();
});
//#endregion

//#region Webpack
task('webpack', done => {
    webpackStream(webpackConfig, webpack).pipe(plumber()).pipe(dest(config.webpack.dist));
    done();
});
task('webpack-watch', done => {
    watch(config.webpack.src, task('webpack'));
    done();
});
//#endregion

//#region Copy
task('copy', done => {
    src(config.copy.src).pipe(plumber()).pipe(dest(config.copy.dist));
    done();
});
task('copy-watch', done => {
    watch(config.copy.src, task('copy'));
    done();
})
//#endregion

//#region Generate license list
task('liclist', done => {
    exec(`license-checker --production --json > ${config.liclist.src}`).then(() => {
        const json = JSON.parse(fs.readFileSync(config.liclist.src));
        let result = {};
        Object.keys(json).forEach(key => {
            result[key] = {
                licenses: json[key].licenses,
                repository: json[key].repository
            };
        });
        fs.writeFileSync(config.liclist.src, JSON.stringify(result));
    });
    done();
});
//#endregion

task('watch', parallel('ts-watch', 'pug-watch', 'sass-watch', 'webpack-watch', 'copy-watch'));

task('default', parallel('ts', 'pug', 'sass', 'webpack', 'copy'));