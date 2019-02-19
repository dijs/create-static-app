import test from 'ava';
import modifyPackage from '../modifyPackage';

test('should use npm and service workers by default', t => {
  t.deepEqual(modifyPackage({ scripts: {} }), {
    devDependencies: {
      'react-snap': '^1.23.0',
      'sw-precache': '^5.2.1'
    },
    reactSnap: {
      skipThirdPartyRequests: true,
      inlineCss: true
    },
    scripts: {
      postbuild: 'react-snap && npm run sw',
      sw: 'sw-precache --root=build --config=sw-precache-config.js --verbose'
    }
  });
});

test('should use yarn', t => {
  t.deepEqual(modifyPackage({ scripts: {} }, { yarn: true, sw: true }), {
    devDependencies: {
      'react-snap': '^1.23.0',
      'sw-precache': '^5.2.1'
    },
    reactSnap: {
      skipThirdPartyRequests: true,
      inlineCss: true
    },
    scripts: {
      postbuild: 'react-snap && yarn run sw',
      sw: 'sw-precache --root=build --config=sw-precache-config.js --verbose'
    }
  });
});

test('should be able to not include service workers', t => {
  t.deepEqual(modifyPackage({ scripts: {} }, { sw: false }), {
    devDependencies: {
      'react-snap': '^1.23.0'
    },
    reactSnap: {
      skipThirdPartyRequests: true,
      inlineCss: true
    },
    scripts: {
      postbuild: 'react-snap'
    }
  });
});

test('should keep previous scripts', t => {
  t.deepEqual(
    modifyPackage({ scripts: { build: 'do stuff here' } }, { sw: false }),
    {
      devDependencies: {
        'react-snap': '^1.23.0'
      },
      reactSnap: {
        skipThirdPartyRequests: true,
        inlineCss: true
      },
      scripts: {
        build: 'do stuff here',
        postbuild: 'react-snap'
      }
    }
  );
});

test('should include domain scripts', t => {
  t.deepEqual(
    modifyPackage({ scripts: {} }, { sw: false, domain: 'mock.com' }),
    {
      devDependencies: {
        'react-snap': '^1.23.0'
      },
      reactSnap: {
        skipThirdPartyRequests: true,
        inlineCss: true
      },
      scripts: {
        'add-domain': 'echo "mock.com" > build/CNAME',
        postbuild: 'react-snap && npm run add-domain'
      }
    }
  );
});
