/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module no-undefined-references
 * @fileoverview
 *   Warn when references to undefined definitions are found.
 *
 *   Options: `Object`, optional.
 *
 *   The object can have an `allow` field, set to an array of strings that may
 *   appear between `[` and `]`, but that should not be treated as link
 *   identifiers.
 *
 * @example {"name": "ok.md"}
 *
 *   [foo][]
 *
 *   Just a [ bracket.
 *
 *   Typically, you’d want to use escapes (with a backslash: \\) to escape what
 *   could turn into a \[reference otherwise].
 *
 *   Just two braces can’t link: [].
 *
 *   [foo]: https://example.com
 *
 * @example {"name": "ok-allow.md", "setting": {"allow": ["...", "…"]}}
 *
 *   > Eliding a portion of a quoted passage […] is acceptable.
 *
 * @example {"name": "not-ok.md", "label": "input"}
 *
 *   [bar]
 *
 *   [baz][]
 *
 *   [text][qux]
 *
 *   Spread [over
 *   lines][]
 *
 *   > in [a
 *   > block quote][]
 *
 *   [asd][a
 *
 *   Can include [*emphasis*].
 *
 *   Multiple pairs: [a][b][c].
 *
 * @example {"name": "not-ok.md", "label": "output"}
 *
 *   1:1-1:6: Found reference to undefined definition
 *   3:1-3:8: Found reference to undefined definition
 *   5:1-5:12: Found reference to undefined definition
 *   7:8-8:9: Found reference to undefined definition
 *   10:6-11:17: Found reference to undefined definition
 *   13:1-13:6: Found reference to undefined definition
 *   15:13-15:25: Found reference to undefined definition
 *   17:17-17:23: Found reference to undefined definition
 *   17:23-17:26: Found reference to undefined definition
 */

'use strict'

var collapseWhiteSpace = require('collapse-white-space')
var vfileLocation = require('vfile-location')
var rule = require('unified-lint-rule')
var generated = require('unist-util-generated')
var position = require('unist-util-position')
var visit = require('unist-util-visit')

module.exports = rule(
  'remark-lint:no-undefined-references',
  noUndefinedReferences
)

var reason = 'Found reference to undefined definition'

// The identifier is upcased to avoid naming collisions with fields inherited
// from `Object.prototype`.
// If `Object.create(null)` was used in place of `{}`, downcasing would work
// equally well.
function normalize(s) {
  return collapseWhiteSpace(s.toUpperCase())
}

function noUndefinedReferences(tree, file, option) {
  var contents = String(file)
  var location = vfileLocation(file)
  var lineEnding = /(\r?\n|\r)[\t ]*(>[\t ]*)*/g
  var allow = ((option || {}).allow || []).map(normalize)
  var map = {}

  visit(tree, ['definition', 'footnoteDefinition'], mark)
  visit(tree, ['imageReference', 'linkReference', 'footnoteReference'], find)
  visit(tree, ['paragraph', 'heading'], findInPhrasing)

  function mark(node) {
    if (!generated(node)) {
      map[normalize(node.identifier)] = true
    }
  }

  function find(node) {
    if (
      !generated(node) &&
      !(normalize(node.identifier) in map) &&
      allow.indexOf(normalize(node.identifier)) === -1
    ) {
      file.message(reason, node)
    }
  }

  function findInPhrasing(node) {
    var ranges = []

    visit(node, onchild)

    ranges.forEach(handleRange)

    return visit.SKIP

    function onchild(child) {
      var start
      var end
      var source
      var lines
      var last
      var index
      var match
      var line
      var code
      var lineIndex
      var next
      var range

      // Ignore the node itself.
      if (child === node) return

      // Can’t have links in links, so reset ranges.
      if (child.type === 'link' || child.type === 'linkReference') {
        ranges = []
        return visit.SKIP
      }

      // Enter non-text.
      if (child.type !== 'text') return

      start = position.start(child).offset
      end = position.end(child).offset

      // Bail if there’s no positional info.
      if (!end) return visit.EXIT

      source = contents.slice(start, end)
      lines = [[start, '']]
      last = 0

      lineEnding.lastIndex = 0
      match = lineEnding.exec(source)

      while (match) {
        index = match.index
        lines[lines.length - 1][1] = source.slice(last, index)
        last = index + match[0].length
        lines.push([start + last, ''])
        match = lineEnding.exec(source)
      }

      lines[lines.length - 1][1] = source.slice(last)
      lineIndex = -1

      while (++lineIndex < lines.length) {
        line = lines[lineIndex][1]
        index = 0

        while (index < line.length) {
          code = line.charCodeAt(index)

          // Skip past escaped brackets.
          if (code === 92) {
            next = line.charCodeAt(index + 1)
            index++

            if (next === 91 || next === 93) {
              index++
            }
          }
          // Opening bracket.
          else if (code === 91) {
            ranges.push([lines[lineIndex][0] + index])
            index++
          }
          // Close bracket.
          else if (code === 93) {
            // No opening.
            if (ranges.length === 0) {
              index++
            } else if (line.charCodeAt(index + 1) === 91) {
              index++

              // Collapsed or full.
              range = ranges.pop()
              range.push(lines[lineIndex][0] + index)

              // This is the end of a reference already.
              if (range.length === 4) {
                handleRange(range)
                range = []
              }

              range.push(lines[lineIndex][0] + index)
              ranges.push(range)
              index++
            } else {
              index++

              // Shortcut or typical end of a reference.
              range = ranges.pop()
              range.push(lines[lineIndex][0] + index)
              handleRange(range)
            }
          }
          // Anything else.
          else {
            index++
          }
        }
      }
    }

    function handleRange(range) {
      var offset

      if (range.length === 1) return
      if (range.length === 3) range.length = 2

      // No need to warn for just `[]`.
      if (range.length === 2 && range[0] + 2 === range[1]) return

      offset = range.length === 4 && range[2] + 2 !== range[3] ? 2 : 0

      find({
        identifier: contents
          .slice(range[0 + offset] + 1, range[1 + offset] - 1)
          .replace(lineEnding, ' '),
        position: {
          start: location.toPosition(range[0]),
          end: location.toPosition(range[range.length - 1])
        }
      })
    }
  }
}
