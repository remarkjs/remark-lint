/**
 * @import {TransformCallback} from 'unified'
 * @import {Plugin, Rule} from 'unified-lint-rule'
 * @import {Node} from 'unist'
 * @import {VFile} from 'vfile'
 */

/**
 * @typedef {'error' | 'on' | 'off' | 'warn'} Label
 *   Severity label;
 *   `'off'`: `0`, `'on'` and `warn`: `1`, `'error'`: `2`.
 *
 * @typedef Meta
 *   Rule metadata.
 * @property {string} origin
 *   Name of the lint rule.
 * @property {string | null | undefined} [url]
 *   Link to documentation (optional).
 *
 * @typedef {0 | 1 | 2} Severity
 *   Severity number;
 *   `0`: `'off'`, `1`: `'on'` and `warn`, `2`: `'error'`.
 */

import {wrap} from 'trough'

/**
 * @template {Node} [Tree=Node]
 *   Node kind.
 * @template {unknown} [Option=unknown]
 *   Parameter kind.
 * @param {Meta | string} meta
 *   Info.
 * @param {Rule<Tree, Option>} rule
 *   Rule.
 * @returns {Plugin<Tree, Option>}
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

  return plugin

  /**
   * @param {[level: Label | Severity | boolean, option?: Option] | Label | Option | Severity} [config]
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
     * @param {TransformCallback<Tree>} next
     *   Next.
     * @returns {undefined}
     *   Nothing.
     */
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
 * @template {unknown} [Option=unknown]
 *   Parameter kind.
 * @param {string} name
 *   Rule name.
 * @param {[level: Label | Severity | boolean, option?: Option] | Option} config
 *   Configuration.
 * @returns {[severity: Severity, parameter: Option | undefined]}
 *   Severity and options.
 */
function coerce(name, config) {
  if (Array.isArray(config)) {
    const [severity, option] = config

    switch (severity) {
      case false:
      case 0:
      case 'off': {
        return [0, option]
      }

      case true:
      case 1:
      case 'on':
      case 'warn': {
        return [1, option]
      }

      case 2:
      case 'error': {
        return [2, option]
      }

      default: {
        if (typeof severity === 'number') {
          throw new Error(
            'Incorrect severity `' +
              severity +
              '` for `' +
              name +
              '`, ' +
              'expected 0, 1, or 2'
          )
        }

        // If we do not know the 1st item of the array,
        // and it’s not a number,
        // assume `config` is *meant* as an array.
        return [1, /** @type {Option} */ (config)]
      }
    }
  }

  return [1, config]
}
