import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'

const globals = {
  'karet.lift': 'karet.lift',
  'kefir.atom': 'kefir.atom',
  'kefir.combines': 'kefir.combines',
  'partial.lenses': 'L',
  infestines: 'I',
  karet: 'karet',
  kefir: 'Kefir',
  ramda: 'R',
  react: 'React'
}

const build = ({NODE_ENV, format, suffix}) => ({
  external: Object.keys(globals),
  input: 'src/karet.util.js',
  output: {
    globals,
    name: 'karet.util',
    format,
    file: `dist/karet.util.${suffix}`
  },
  plugins: [
    NODE_ENV && replace({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Component',
          'Fragment',
          'createContext',
          'createElement',
          'forwardRef'
        ]
      }
    }),
    babel(),
    NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
})

export default [
  build({format: 'cjs', suffix: 'cjs.js'}),
  build({format: 'es', suffix: 'es.js'}),
  build({format: 'umd', suffix: 'js', NODE_ENV: 'dev'}),
  build({format: 'umd', suffix: 'min.js', NODE_ENV: 'production'})
]
