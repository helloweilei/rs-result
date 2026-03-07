import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  // ESM build
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  // CommonJS build
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  // Minified ESM
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.esm.min.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
  // Minified CommonJS
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.cjs.min.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];
