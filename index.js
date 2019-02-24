#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const modifyPackage = require('./modifyPackage');
const argv = require('./handleArgs');

const projectName = argv._[0];

const log = (...args) => {
  if (argv.verbose) {
    console.log(...args.map(m => chalk.yellow(m.toString())));
  }
};

log('Project name', projectName);

function addDeps() {
  const packageDir = path.resolve('.', projectName);
  const packagePath = path.join(packageDir, 'package.json');
  log('Found package @', packagePath);
  const package = modifyPackage(require(packagePath), argv);
  if (argv.sw) {
    log('Copying service worker config');
    fs.copyFileSync(
      path.join(__dirname, 'sw-precache-config.js'),
      path.join(packageDir, 'sw-precache-config.js')
    );
  }
  log('Writing package changes');
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 3));
}

function install() {
  const command = argv.yarn ? 'yarn' : 'npm';
  log('Installing deps using', command);
  const installer = spawn(command, ['install'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, projectName)
  });
  installer.on('close', () => {
    console.log(
      chalk.red(
        `Navigate to "${projectName}" and run "${command} build" to generate your static app`
      )
    );
  });
}

function createApp() {
  const craPath = require.resolve('create-react-app');
  const cra = spawn(craPath, [projectName], { stdio: 'inherit' });
  cra.on('close', () => {
    log('Created project.');
    addDeps();
    install();
  });
}

createApp();
