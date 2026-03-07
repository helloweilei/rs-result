import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  // ESM build
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: false,
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
      sourcemap: false,
      exports: 'named',
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
];
