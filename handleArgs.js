const argv = require('yargs')
  .usage('create-static-app <project-directory>')
  .option('react', {
    alias: 'r',
    type: 'boolean',
    describe: 'Create a React project',
    default: true
  })
  .option('domain', {
    alias: 'd',
    describe: 'domain to use for CNAME (Github Pages)'
  })
  .option('yarn', {
    alias: 'y',
    type: 'boolean',
    describe: 'Setup using yarn instead of npm',
    default: false
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    default: false
  })
  .option('service-worker', {
    alias: 'sw',
    type: 'boolean',
    describe:
      'Setup app with service worker already configured for static assets',
    default: true
  }).argv;

if (!argv._.length) {
  console.error('You must specify a project directory');
  process.exit();
}

module.exports = argv;
