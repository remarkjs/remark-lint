/**
 * @author Titus Wormer
 * @copyright 2017 Titus Wormer
 * @license MIT
 * @module linebreak-style
 * @fileoverview
 *   Warn when linebreaks violate a given or detected style.
 *
 *   Options: either `'unix'` (for `\n`, denoted as `␊`), `'windows'` (for `\r\n`,
 *   denoted as `␍␊`), or `'consistent'` (to detect the first used linebreak in
 *   a file).  Default: `'consistent'`.
 *
 *   ## Fix
 *
 *   [`remark-stringify`](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify)
 *   always uses unix-style linebreaks.
 *
 *   See [Using remark to fix your markdown](https://github.com/remarkjs/remark-lint#using-remark-to-fix-your-markdown)
 *   on how to automatically fix warnings for this rule.
 *
 * @example {"name": "valid-consistent-as-windows.md"}
 *
 *   Alpha␍␊
 *   Bravo␍␊
 *
 * @example {"name": "valid-consistent-as-unix.md"}
 *
 *   Alpha␊
 *   Bravo␊
 *
 * @example {"name": "invalid-unix.md", "label": "input", "setting": "unix", "config": {"positionless": true}}
 *
 *   Alpha␍␊
 *
 * @example {"name": "invalid-unix.md", "label": "output", "setting": "unix"}
 *
 *   1:7: Expected linebreaks to be unix (`\n`), not windows (`\r\n`)
 *
 * @example {"name": "invalid-windows.md", "label": "input", "setting": "windows", "config": {"positionless": true}}
 *
 *   Alpha␊
 *
 * @example {"name": "invalid-windows.md", "label": "output", "setting": "windows"}
 *
 *   1:6: Expected linebreaks to be windows (`\r\n`), not unix (`\n`)
 */

'use strict';

var rule = require('unified-lint-rule');
var location = require('vfile-location');

module.exports = rule('remark-lint:linebreak-style', linebreakStyle);

var sequences = {
  unix: '\n',
  windows: '\r\n'
};

var escaped = {
  unix: '\\n',
  windows: '\\r\\n'
};

function linebreakStyle(ast, file, preferred) {
  var content = String(file);
  var position = location(content).toPosition;
  var index = content.indexOf('\n');
  var type;

  preferred = typeof preferred !== 'string' || preferred === 'consistent' ? null : preferred;

  while (index !== -1) {
    type = content.charAt(index - 1) === '\r' ? 'windows' : 'unix';

    if (preferred) {
      if (sequences[preferred] !== sequences[type]) {
        file.message(
          'Expected linebreaks to be ' + preferred + ' (`' + escaped[preferred] + '`), ' +
          'not ' + type + ' (`' + escaped[type] + '`)',
          position(index)
        );
      }
    } else {
      preferred = type;
    }

    index = content.indexOf('\n', index + 1);
  }
}
