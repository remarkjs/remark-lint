/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {0 | 1 | 2} Severity
 *   Numeric severity (`0`: `'off'`, `1`: `'on'`, `2`: `'error'`).
 * @typedef {'warn' | 'on' | 'off' | 'error'} Label
 *   Severity label (`'off'`: `0`, `'on'`: `1`, `'error'`: `2`).
 * @typedef {[Severity, ...Array<unknown>]} SeverityTuple
 *   Parsed severty and options.
 *
 * @typedef RuleMeta
 *   Rule metadata.
 * @property {string} origin
 *   Name of the lint rule.
 * @property {string | null | undefined} [url]
 *   Link to documentation.
 */

/**
 * @template {Node} [Tree=Node]
 * @template {any} [Options=unknown]
 * @callback Rule
 * @param {Tree} tree
 * @param {VFile} file
 * @param {Options} options
 * @returns {Promise<Tree | undefined | void> | Tree | undefined | void}
 */

import {wrap} from 'trough'

/**
 * @template {Node} [Tree=Node]
 * @template {any} [Options=unknown]
 * @param {string | RuleMeta} meta
 * @param {Rule<Tree, Options>} rule
 * @returns {import('unified').Plugin<Array<void> | [Options | [boolean | Label | Severity, (Options | undefined)?]], Tree>}
 */
export function lintRule(meta, rule) {
  const id = typeof meta === 'string' ? meta : meta.origin
  const url = typeof meta === 'string' ? undefined : meta.url
  const parts = id.split(':')
  // Possibly useful if externalised later.
  /* c8 ignore next */
  const source = parts[1] ? parts[0] : undefined
  const ruleId = parts[1]

  Object.defineProperty(plugin, 'name', {value: id})

  // @ts-expect-error: to do: fix.
  return plugin

  /** @type {import('unified').Plugin<[unknown] | Array<void>>} */
  function plugin(config) {
    const [severity, options] = coerce(ruleId, config)

    if (!severity) return

    const fatal = severity === 2

    return (tree, file, next) => {
      let index = file.messages.length - 1

      wrap(rule, (error) => {
        const messages = file.messages

        // Add the error, if not already properly added.
        // Only happens for incorrect plugins.
        /* c8 ignore next 6 */
        // @ts-expect-error: errors could be `messages`.
        if (error && !messages.includes(error)) {
          try {
            file.fail(error)
          } catch {}
        }

        while (++index < messages.length) {
          Object.assign(messages[index], {ruleId, source, fatal, url})
        }

        next()
      })(tree, file, options)
    }
  }
}

/**
 * Coerce a value to a severity--options tuple.
 *
 * @param {string} name
 * @param {unknown} config
 * @returns {SeverityTuple}
 */
function coerce(name, config) {
  if (!Array.isArray(config)) return [1, config]
  /** @type {Array<unknown>} */
  const [severity, ...options] = config
  switch (severity) {
    case false:
    case 'off':
    case 0: {
      return [0, ...options]
    }

    case true:
    case 'on':
    case 'warn':
    case 1: {
      return [1, ...options]
    }

    case 'error':
    case 2: {
      return [2, ...options]
    }

    default: {
      if (typeof severity !== 'number') return [1, config]
      throw new Error(
        'Incorrect severity `' +
          severity +
          '` for `' +
          name +
          '`, ' +
          'expected 0, 1, or 2'
      )
    }
  }
}
