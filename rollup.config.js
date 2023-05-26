import terser from '@rollup/plugin-terser';

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
};