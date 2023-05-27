import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
 input: 'src/index.js',
 output: [
   {
     file: 'dist/BreezeRouter.js',
     format: 'esm',
     name: 'BreezeRouter',
     sourcemap: true,
   },
   {
     file: 'dist/BreezeRouter.min.js',
     format: 'esm',
     name: 'BreezeRouter',
     plugins: [terser()],
     sourcemap: true,
   },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'src/types.js', dest: 'dist'}
      ]
    })
  ]
};