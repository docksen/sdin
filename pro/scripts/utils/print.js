const { isFunction } = require('lodash')

function red(msg) {
  return msg ? '\x1B[31m' + msg + '\x1B[0m' : ''
}

function green(msg) {
  return msg ? '\x1B[32m' + msg + '\x1B[0m' : ''
}

function yellow(msg) {
  return msg ? '\x1B[33m' + msg + '\x1B[0m' : ''
}

function blue(msg) {
  return msg ? '\x1B[34m' + msg + '\x1B[0m' : ''
}

function magenta(msg) {
  return msg ? '\x1B[35m' + msg + '\x1B[0m' : ''
}

function cyan(msg) {
  return msg ? '\x1B[36m' + msg + '\x1B[0m' : ''
}

function getErrorMessage(err) {
  if (err instanceof Error) {
    return err.message
  } else {
    return err.toString()
  }
}

function print(msg, icon, exitCode, noBlank) {
  if (msg) {
    if (msg instanceof Error) {
      console.error(msg)
    } else {
      const text = (icon ? icon + ' ' : '') + msg
      if (noBlank) {
        process.stdout.write(text)
      } else {
        console.log(text)
      }
    }
    if (Number.isInteger(exitCode)) {
      console.log()
      process.exit(exitCode)
    }
  }
}

function printInfo(msg, exitCode) {
  if (exitCode) {
    print(msg, blue('i'), exitCode)
  } else {
    print(msg, blue('i'))
  }
}

function printWarn(msg, exitCode) {
  if (exitCode) {
    print(msg, yellow('!'), exitCode)
  } else {
    print(msg, yellow('!'))
  }
}

function printError(msg, exitCode) {
  if (exitCode) {
    print(msg, red('x'), exitCode)
  } else {
    print(msg, red('x'))
  }
}

function printSuccess(msg, exitCode) {
  if (exitCode) {
    print(msg, green('√'), exitCode)
  } else {
    print(msg, green('√'))
  }
}

module.exports = {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  getErrorMessage,
  print,
  printInfo,
  printWarn,
  printError,
  printSuccess
}
