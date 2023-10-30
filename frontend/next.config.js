/** @type {import('next').NextConfig} */

const withLess = require('next-with-less');
const nextComposePlugins = require('next-compose-plugins');

const { withPlugins } = nextComposePlugins.extend(() => ({}));

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {},
    },
  ],
];
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  eslint: {
    dirs: ['pages', 'utils', 'app', 'components', 'src', '__tests__'],
  },
  env: {
    API_URL: process.env.API_URL,
  },

  webpack(config, { dev, isServer }) {
    // If not in development mode, avoid minification
    // Currently minification breaks production build for the table
    // Error: Application error: a client-side exception has occurred (see the browser console for more information)
    if (!dev) {
      config.optimization.minimize = false;
      // Disable minifying JavaScript
      config.optimization.minimizer = [];
    }

    return config;
  },
};

module.exports = withPlugins(plugins, nextConfig);
