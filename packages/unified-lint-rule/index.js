import {wrap} from 'trough'

export function lintRule(id, rule) {
  const parts = id.split(':')
  // Possibly useful if externalised later.
  /* c8 ignore next */
  const source = parts[1] ? parts[0] : undefined
  const ruleId = parts[1]

  Object.defineProperty(plugin, 'name', {value: id})

  return plugin

  function plugin(raw) {
    const [severity, options] = coerce(ruleId, raw)

    if (!severity) return

    const fatal = severity === 2

    return (tree, file, next) => {
      let index = file.messages.length - 1

      wrap(rule, (error) => {
        const messages = file.messages

        // Add the error, if not already properly added.
        // Only happens for incorrect plugins.
        /* c8 ignore next 5 */
        if (error && !messages.includes(error)) {
          try {
            file.fail(error)
          } catch {}
        }

        while (++index < messages.length) {
          Object.assign(messages[index], {ruleId, source, fatal})
        }

        next()
      })(tree, file, options)
    }
  }
}

// Coerce a value to a severity--options tuple.
function coerce(name, value) {
  const def = 1
  let result

  // Handled by unified in v6.0.0.
  /* c8 ignore next 3 */
  if (typeof value === 'boolean') {
    result = [value]
  } else if (value === null || value === undefined) {
    result = [def]
  } else if (
    Array.isArray(value) &&
    (typeof value[0] === 'number' ||
      typeof value[0] === 'boolean' ||
      typeof value[0] === 'string')
  ) {
    result = [...value]
  } else {
    result = [1, value]
  }

  let level = result[0]

  if (typeof level === 'boolean') {
    level = level ? 1 : 0
  } else if (typeof level === 'string') {
    if (level === 'off') {
      level = 0
    } else if (level === 'on' || level === 'warn') {
      level = 1
    } else if (level === 'error') {
      level = 2
    } else {
      level = 1
      result = [level, result]
    }
  }

  if (level < 0 || level > 2) {
    throw new Error(
      'Incorrect severity `' +
        level +
        '` for `' +
        name +
        '`, ' +
        'expected 0, 1, or 2'
    )
  }

  result[0] = level

  return result
}
