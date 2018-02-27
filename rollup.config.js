import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
    },
    {
      file: 'lib/index.mjs',
      format: 'es',
    },
  ],
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['ajv'],
};
