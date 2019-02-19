const commands = (...args) => {
  return args
    .reduce((arr, e) => {
      if (typeof e === 'object') {
        for (const key in e) {
          if (e[key]) arr.push(key);
        }
      } else {
        arr.push(e);
      }
      return arr;
    }, [])
    .join(' && ');
};

function modifyPackage(
  pkg,
  argv = { yarn: false, sw: true, domain: undefined }
) {
  const command = argv.yarn ? 'yarn' : 'npm';
  pkg.devDependencies = {
    'react-snap': '^1.23.0'
  };
  if (argv.sw) {
    pkg.devDependencies['sw-precache'] = '^5.2.1';
  }
  pkg.reactSnap = {
    skipThirdPartyRequests: true,
    inlineCss: true
  };
  const scripts = {};
  if (argv.sw) {
    scripts.sw =
      'sw-precache --root=build --config=sw-precache-config.js --verbose';
  }
  if (argv.domain) {
    scripts['add-domain'] = `echo "${argv.domain}" > build/CNAME`;
  }
  scripts.postbuild = commands('react-snap', {
    [`${command} run sw`]: argv.sw,
    [`${command} run add-domain`]: argv.domain
  });
  Object.assign(pkg.scripts, scripts);
  return pkg;
}

module.exports = modifyPackage;
