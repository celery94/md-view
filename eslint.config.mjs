import nextConfig from 'eslint-config-next/core-web-vitals';

const ignores = [
  '.next/**',
  'node_modules/**',
  'dist/**',
  'build/**',
  'coverage/**',
];

const config = [
  { ignores },
  ...nextConfig,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react/jsx-key': 'warn',
    },
  },
];

export default config;
