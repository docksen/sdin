import { printError } from 'utils/print'

process.on('uncaughtException', error => {
  printError('Uncaught exception.', error, -1)
})

process.on('unhandledRejection', reason => {
  if (reason instanceof Error) {
    printError('Unhandled rejection.', reason, -2)
  } else {
    printError(reason || 'Unhandled rejection.', -2)
  }
})
