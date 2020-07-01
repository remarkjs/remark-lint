/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module maximum-line-length
 * @fileoverview
 *   Warn when lines are too long.
 *
 *   Options: `number`, default: `80`.
 *
 *   Ignores nodes that cannot be wrapped, such as headings, tables, code,
 *   definitions, HTML, and JSX.
 *
 *   Ignores images, links, and inline code if they start before the wrap, end
 *   after the wrap, and there’s no whitespace after them.
 *
 * @example {"name": "ok.md", "config": {"positionless": true}}
 *
 *   This line is simply not toooooooooooooooooooooooooooooooooooooooooooo
 *   long.
 *
 *   This is also fine: <http://this-long-url-with-a-long-domain.co.uk/a-long-path?query=variables>
 *
 *   <http://this-link-is-fine.com>
 *
 *   `alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscarPapaQuebec.romeo()`
 *
 *   [foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)
 *
 *   <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>
 *
 *   ![foo](http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables)
 *
 *   | An | exception | is | line | length | in | long | tables | because | those | can’t | just |
 *   | -- | --------- | -- | ---- | ------ | -- | ---- | ------ | ------- | ----- | ----- | ---- |
 *   | be | helped    |    |      |        |    |      |        |         |       |       | .    |
 *
 *   <a><b><i><p><q><s><u>alpha bravo charlie delta echo foxtrot golf</u></s></q></p></i></b></a>
 *
 *   The following is also fine, because there is no whitespace.
 *
 *   <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>.
 *
 *   In addition, definitions are also fine:
 *
 *   [foo]: <http://this-long-url-with-a-long-domain-is-ok.co.uk/a-long-path?query=variables>
 *
 * @example {"name": "not-ok.md", "setting": 80, "label": "input", "config": {"positionless": true}}
 *
 *   This line is simply not tooooooooooooooooooooooooooooooooooooooooooooooooooooooo
 *   long.
 *
 *   Just like thiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis one.
 *
 *   And this one is also very wrong: because the link starts aaaaaaafter the column: <http://line.com>
 *
 *   <http://this-long-url-with-a-long-domain-is-not-ok.co.uk/a-long-path?query=variables> and such.
 *
 *   And this one is also very wrong: because the code starts aaaaaaafter the column: `alpha.bravo()`
 *
 *   `alphaBravoCharlieDeltaEchoFoxtrotGolfHotelIndiaJuliettKiloLimaMikeNovemberOscar.papa()` and such.
 *
 * @example {"name": "not-ok.md", "setting": 80, "label": "output", "config": {"positionless": true}}
 *
 *   4:86: Line must be at most 80 characters
 *   6:99: Line must be at most 80 characters
 *   8:96: Line must be at most 80 characters
 *   10:97: Line must be at most 80 characters
 *   12:99: Line must be at most 80 characters
 *
 * @example {"name": "ok-mixed-line-endings.md", "setting": 10, "config": {"positionless": true}}
 *
 *   0123456789␍␊
 *   0123456789␊
 *   01234␍␊
 *   01234␊
 *
 * @example {"name": "not-ok-mixed-line-endings.md", "setting": 10, "label": "input", "config": {"positionless": true}}
 *
 *   012345678901␍␊
 *   012345678901␊
 *   01234567890␍␊
 *   01234567890␊
 *
 * @example {"name": "not-ok-mixed-line-endings.md", "setting": 10, "label": "output", "config": {"positionless": true}}
 *
 *   1:13: Line must be at most 10 characters
 *   2:13: Line must be at most 10 characters
 *   3:12: Line must be at most 10 characters
 *   4:12: Line must be at most 10 characters
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule('remark-lint:maximum-line-length', maximumLineLength)

var start = position.start
var end = position.end

function maximumLineLength(tree, file, option) {
  var preferred = typeof option === 'number' && !isNaN(option) ? option : 80
  var content = String(file)
  var lines = content.split(/\r?\n/)
  var length = lines.length
  var index = -1
  var lineLength

  // Note: JSX is from MDX: <https://github.com/mdx-js/specification>.
  visit(
    tree,
    ['heading', 'table', 'code', 'definition', 'html', 'jsx', 'yaml', 'toml'],
    ignore
  )
  visit(tree, ['link', 'image', 'inlineCode'], inline)

  // Iterate over every line, and warn for violating lines.
  while (++index < length) {
    lineLength = lines[index].length

    if (lineLength > preferred) {
      file.message('Line must be at most ' + preferred + ' characters', {
        line: index + 1,
        column: lineLength + 1
      })
    }
  }

  // Finally, allow some inline spans, but only if they occur at or after
  // the wrap.
  // However, when they do, and there’s whitespace after it, they are not
  // allowed.
  function inline(node, pos, parent) {
    var next = parent.children[pos + 1]
    var initial
    var final

    /* istanbul ignore if - Nothing to allow when generated. */
    if (generated(node)) {
      return
    }

    initial = start(node)
    final = end(node)

    // Not allowing when starting after the border, or ending before it.
    if (initial.column > preferred || final.column < preferred) {
      return
    }

    // Not allowing when there’s whitespace after the link.
    if (
      next &&
      start(next).line === initial.line &&
      (!next.value || /^(.+?[ \t].+?)/.test(next.value))
    ) {
      return
    }

    allowList(initial.line - 1, final.line)
  }

  function ignore(node) {
    /* istanbul ignore else - Hard to test, as we only run this case on `position: true` */
    if (!generated(node)) {
      allowList(start(node).line - 1, end(node).line)
    }
  }

  // Allowlist from `initial` to `final`, zero-based.
  function allowList(initial, final) {
    while (initial < final) {
      lines[initial++] = ''
    }
  }
}
