'use strict';

var fs = require('fs');
var path = require('path');
/*  */

var isJS = function (file) { return /\.js(\?[^.]+)?$/.test(file); };

var isCSS = function (file) { return /\.css(\?[^.]+)?$/.test(file); };

// logger
var ref = require('chalk');
var red = ref.red;
var yellow = ref.yellow;

var prefix = "[create-entry-webpack-plugin]";
var warn = exports.warn = function (msg) { return console.error(red((prefix + " " + msg + "\n"))); };
var tip = exports.tip = function (msg) { return console.log(yellow((prefix + " " + msg + "\n"))); };

// webpack版本兼容
var onEmit = function (compiler, name, hook) {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.emit.tapAsync(name, hook);
  } else {
    // Webpack < 4.0.0
    compiler.plugin('emit', hook);
  }
};

var uniq = require('lodash.uniq');

var CreateEntryPlugin = function CreateEntryPlugin (options) {
  if (options === void 0) options = {};

  this.options = Object.assign({
    filename: 'entry.js',
    publicPath: undefined,
    template: undefined
  }, options);
};

CreateEntryPlugin.prototype.apply = function apply (compiler) {
  var this$1 = this;

  onEmit(compiler, 'create-entry-plugin', function (compilation, cb) {
    var stats = compilation.getStats().toJson();
    var publicPath = this$1.options.publicPath || stats.publicPath

    // 页面初始化所需的js文件列表
    var initialJs = uniq(Object.keys(stats.entrypoints)
      .map(function (name) { return stats.entrypoints[name].assets; })
      .reduce(function (assets, all) { return all.concat(assets); }, [])
      .filter(function (file) { return isJS(file) }));
    // 页面初始化所需的css文件列表
    var initialCss = uniq(Object.keys(stats.entrypoints)
      .map(function (name) { return stats.entrypoints[name].assets; })
      .reduce(function (assets, all) { return all.concat(assets); }, [])
      .filter(function (file) { return isCSS(file); }));

    var entryjsContent = '';

    if (this$1.options.template) {
      var template = path.resolve(compiler.context, this$1.options.template);
      if (fs.existsSync(template)) {
        entryjsContent = fs.readFileSync(template).toString() + '\n';
      } else {
        warn('template is not find');
      }
    }

    initialCss.forEach(function (cssPath) {
      entryjsContent += `document.write('<link href="${publicPath + cssPath}" rel="stylesheet">');\n`;
    });
    initialJs.forEach(function (jsPath) {
      entryjsContent += `document.write('<script src="${publicPath + jsPath}"></script>');\n`;
    });

    compilation.assets[this$1.options.filename] = {
      source: function () { return entryjsContent; },
      size: function () { return entryjsContent.length; }
    };
    cb();
  });
};

module.exports = CreateEntryPlugin;