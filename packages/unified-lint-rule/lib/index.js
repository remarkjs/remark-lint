/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {'error' | 'on' | 'off' | 'warn'} Label
 *   Severity label (`'off'`: `0`, `'on'`: `1`, `'error'`: `2`).
 *
 * @typedef RuleMeta
 *   Rule metadata.
 * @property {string} origin
 *   Name of the lint rule.
 * @property {string | null | undefined} [url]
 *   Link to documentation (optional).
 *
 * @typedef {0 | 1 | 2} Severity
 *   Numeric severity (`0`: `'off'`, `1`: `'on'`, `2`: `'error'`).
 *
 * @typedef {[severity: Severity, ...parameters: Array<unknown>]} SeverityTuple
 *   Parsed severty and options.
 */

/**
 * @template {Node} [Tree=Node]
 *   Node kind (optional).
 * @template {any} [Option=unknown]
 *   Parameter kind (optional).
 * @callback Rule
 *   Rule.
 * @param {Tree} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @param {Option} option
 *   Parameter.
 * @returns {Promise<Tree | undefined | void> | Tree | undefined | void}
 *   Result.
 */

import {wrap} from 'trough'

/**
 * @template {Node} [Tree=Node]
 *   Node kind.
 * @template {any} [Option=unknown]
 *   Parameter kind.
 * @param {RuleMeta | string} meta
 *   Info.
 * @param {Rule<Tree, Option>} rule
 *   Rule.
 * @returns
 *   Plugin.
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

  return plugin

  /**
   * @param {Option | [level: Label | Severity, option?: Option]} [config]
   *   Config.
   * @returns
   *   Transform, if on.
   */
  function plugin(config) {
    const [severity, options] = coerce(ruleId, config)

    const fatal = severity === 2

    if (!severity) return

    /**
     * @param {Tree} tree
     *   Tree.
     * @param {VFile} file
     *   File.
     * @param {import('unified').TransformCallback<Tree>} next
     *   Next.
     * @returns {undefined}
     *   Nothing.
     */
    return function (tree, file, next) {
      let index = file.messages.length - 1

      wrap(rule, function (error) {
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
