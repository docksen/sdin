module.exports = {
  type: 'package',
  buildWeb: false,
  useUglify: false,
  alias: {
    bin: 'src/bin',
    core: 'src/core',
    main: 'src/main',
    utils: 'src/utils'
  }
}
