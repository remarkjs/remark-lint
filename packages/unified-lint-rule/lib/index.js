/**
 * @typedef {import('unist').Node} Node
 */

/**
 * @typedef {[severity: import('../index.js').Severity, ...parameters: Array<unknown>]} SeverityTuple
 *   Parsed severty and options.
 */

import {wrap} from 'trough'

/**
 * @template {Node} [Tree=Node]
 *   Node kind.
 * @template {any} [Option=never]
 *   Parameter kind.
 * @param {import('../index.js').Meta | string} meta
 *   Info.
 * @param {import('../index.js').Rule<Tree, Option>} rule
 *   Rule.
 * @returns {import('unified').Plugin<[(
 *   | [level: import('../index.js').Label | import('../index.js').Severity, option?: Option]
 *   | import('../index.js').Label
 *   | Option
 *   | import('../index.js').Severity
 * )?], Tree>}
 *   Plugin.
 */
export function lintRule(meta, rule) {
  const id = typeof meta === 'string' ? meta : meta.origin
  const url = typeof meta === 'string' ? undefined : meta.url
  const parts = id.split(':')
  /* c8 ignore next -- Possibly useful if externalised later. */
  const source = parts[1] ? parts[0] : undefined
  const ruleId = parts[1]

  Object.defineProperty(plugin, 'name', {value: id})

  // @ts-expect-error Not sure what’s going on here, but it works.
  return plugin

  /**
   * @param {[level: import('../index.js').Label | import('../index.js').Severity, option?: Option] | import('../index.js').Label | Option | import('../index.js').Severity} [config]
   *   Config.
   * @returns {import('unified').Transformer<Tree> | undefined}
   *   Transform, if on.
   */
  function plugin(config) {
    const [severity, options] = coerce(ruleId, config)

    const fatal = severity === 2

    if (!severity) return

    return function (tree, file, next) {
      let index = file.messages.length - 1

      wrap(rule, function (error) {
        const messages = file.messages

        /* c8 ignore next 8 -- add the error,
         * if not already properly added.
         * Only happens for incorrect plugins. */
        // @ts-expect-error: errors could be `messages`.
        if (error && !messages.includes(error)) {
          try {
            file.fail(error)
          } catch {}
        }

        while (++index < messages.length) {
          Object.assign(messages[index], {fatal, ruleId, source, url})
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
 *   Rule name.
 * @param {unknown} config
 *   Configuration.
 * @returns {SeverityTuple}
 *   Severity and options.
 */
function coerce(name, config) {
  if (!Array.isArray(config)) {
    return [1, config]
  }

  /** @type {Array<unknown>} */
  const [severity, ...options] = config
  switch (severity) {
    case false:
    case 0:
    case 'off': {
      return [0, ...options]
    }

    case true:
    case 1:
    case 'on':
    case 'warn': {
      return [1, ...options]
    }

    case 2:
    case 'error': {
      return [2, ...options]
    }

    default: {
      if (typeof severity !== 'number') {
        return [1, config]
      }

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
