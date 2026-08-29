const { printError } = require('./print')

function pipeline(...sources) {
  return new Promise((resolve, reject) => {
    let curr = undefined
    let prev = undefined
    for (let i = 0; i < sources.length; i++) {
      curr = sources[i]
      if (typeof curr === 'function') {
        prev = curr(prev)
      } else if (curr && curr.write) {
        curr.on('error', reject)
        if (prev && prev.pipe) {
          prev = prev.pipe(curr)
        } else {
          prev = curr
        }
      }
    }
    if (!curr) {
      printError('No streams, cannot concat sources to pipeline', 99898758)
    }
    if (resolve) {
      curr.on('end', resolve)
    }
    return curr
  })
}

function reverseGulpFilterPattern(pattern) {
  if (typeof pattern === 'string') {
    return pattern[0] === '!' ? pattern.slice(1) : '!' + pattern
  }
  if (Array.isArray(pattern)) {
    return pattern.map(item => (item[0] === '!' ? item.slice(1) : '!' + item))
  }
  if (typeof pattern === 'function') {
    return file => !pattern(file)
  }
  return pattern
}

module.exports = {
  pipeline,
  reverseGulpFilterPattern
}
