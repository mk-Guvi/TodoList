/** @type {import('next').NextConfig} */

const moduleExports = {
  reactStrictMode: true,
  distDir: 'build',
  eslint: {
    dirs: ['pages', 'components', 'containers', 'redux', 'services', 'integrations', 'utils'],
  },
};

module.exports = moduleExports;
