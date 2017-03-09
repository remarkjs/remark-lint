'use strict';

var path = require('path');
var vfile = require('to-vfile');
var remark = require('remark');
var zone = require('mdast-zone');
var report = require('vfile-reporter');
var u = require('unist-builder');
var validateLinks = require('remark-validate-links');
var config = require('../.remarkrc');
var presets = require('./util/presets');

var root = path.join(process.cwd(), 'packages');
var fp = path.join('readme.md');

remark()
  .use(config)
  .use(plugin)
  .use(validateLinks, false)
  .process(vfile.readSync(fp), function (err, file) {
    if (file) {
      vfile.writeSync(file);
      file.stored = true;
    }

    console.error(report(err || file));
  });

function plugin() {
  return transformer;
}

function transformer(tree) {
  zone(tree, 'presets', replace);
}

function replace(start, nodes, end) {
  var items = presets(root).map(function (basename) {
    var pack = require(path.join(root, basename, 'package.json'));
    var description = pack.description.replace(/^remark preset to configure remark-lint with ?/i, '');

    return u('listItem', [
      u('paragraph', [
        u('link', {url: pack.repository}, [u('inlineCode', basename)]),
        u('text', ' — ' + description)
      ])
    ]);
  });

  return [start, u('list', {ordered: false}, items), end];
}
