#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const modifyPackage = require('./modifyPackage');
const argv = require('./handleArgs');

const projectName = argv._[0];

function addDeps() {
  const packagePath = path.join(__dirname, projectName, 'package.json');
  const package = modifyPackage(require(packagePath), argv);
  if (argv.sw) {
    fs.copyFileSync(
      './sw-precache-config.js',
      path.join(__dirname, projectName, 'sw-precache-config.js')
    );
  }
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 3));
}

function install() {
  const command = argv.yarn ? 'yarn' : 'npm';
  const installer = spawn(command, ['install'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, projectName)
  });
  installer.on('close', () => {
    console.log(
      `Navigate to "${projectName}" and run "${command} build" to generate your static app`
    );
  });
}

function createApp() {
  const craPath = require.resolve('create-react-app');
  const cra = spawn(craPath, [projectName], { stdio: 'inherit' });
  cra.on('close', () => {
    console.log('Created project.');
    addDeps();
    install();
  });
}

createApp();
