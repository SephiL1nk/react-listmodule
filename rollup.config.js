// node-resolve will resolve all the node dependencies
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
// Convert CJS modules to ES6, so they can be included in a bundle
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json'
import external from 'rollup-plugin-peer-deps-external'

const cssExportMap = {}

export default {
  input: 'src/index.js',
  output: [{
    file: pkg.main,
    format: 'es'
  }],
  // All the used libs needs to be here
  external: [
    'axios'
  ],
  plugins: [
    external({
      includeDependencies: true
    }),
    resolve({ 
      preferBuiltins: false,
      extensions: [ '.mjs', '.js', '.jsx', '.json' ]
    }),
    postcss({
      modules: true
    }),
    json({
      'include': 'node_modules/**'
    }),
    babel({
      runtimeHelpers: true,
      presets: [["@babel/preset-env"], "@babel/preset-react"],
      plugins: [
        "@babel/plugin-proposal-class-properties",  
        "@babel/plugin-proposal-export-default-from", 
        "transform-react-remove-prop-types"
      ],
      exclude: [
        'node_modules/**'
      ],
      babelrc: false
    }),
    commonjs({
      namedExports: {
        'node_modules/react-is/index.js': ['ForwardRef', 'isValidElementType'],
        'node_modules/@material-ui/styles/index.js': [
          'MuiThemeProvider',
          'withStyles',
        ],
        'node_modules/prop-types/index.js': ['element', 'default', 'func', 'bool', 'oneOfType', 'elementType']
      }
    })
  ]
}