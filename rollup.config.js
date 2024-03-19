import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import clear from 'rollup-plugin-clear'
import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import conditional from 'rollup-plugin-conditional'

const output = {
  dir: 'dist',
  format: 'cjs',
}
const isTerser = false

export default {
  input: {
    index: 'src/index.ts',
  },
  output,
  plugins: [
    clear({ targets: [output.dir] }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
        },
      },
    }),
    commonjs({ ignoreDynamicRequires: true }),
    nodeResolve({ preferBuiltins: true }),
    json(),
    conditional(isTerser, () => [terser()]),
  ],
  cache: false,
  strictDeprecations: true,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
}
