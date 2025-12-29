const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  // Common options for aggressive minification
  const commonOptions = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    external: ['react', 'react-dom'],
    target: ['es2020'],
    treeShaking: true,
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    keepNames: false,
    drop: ['console', 'debugger'],
    pure: ['console.log', 'console.warn', 'console.info'],
    legalComments: 'none',
    charset: 'utf8',
    // Mangling options for smaller output
    mangleProps: /^_/,
    reserveProps: /^__/,
  };

  // Build ESM (minified)
  await esbuild.build({
    ...commonOptions,
    outfile: 'dist/esm/index.js',
    format: 'esm',
    sourcemap: false,
  });

  // Build CJS (minified)
  await esbuild.build({
    ...commonOptions,
    outfile: 'dist/cjs/index.js',
    format: 'cjs',
    sourcemap: false,
  });

  // Build standalone IIFE for demos (no React dependency, only confetti function)
  await esbuild.build({
    entryPoints: ['src/confetti.ts'],
    bundle: true,
    outfile: 'dist/confetti.browser.js',
    format: 'iife',
    globalName: 'ReactConfettiBurst',
    target: ['es2020'],
    treeShaking: true,
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    keepNames: false,
    drop: ['console', 'debugger'],
    legalComments: 'none',
    charset: 'utf8',
    sourcemap: false,
  });

  console.log('✅ Build complete!');
  
  // Report sizes
  const esmSize = fs.statSync('dist/esm/index.js').size;
  const cjsSize = fs.statSync('dist/cjs/index.js').size;
  const gzipEstimate = Math.round(esmSize * 0.35); // ~35% gzip ratio estimate
  
  console.log(`📦 ESM: ${(esmSize / 1024).toFixed(2)} KB`);
  console.log(`📦 CJS: ${(cjsSize / 1024).toFixed(2)} KB`);
  console.log(`📦 ESM (gzip est.): ${(gzipEstimate / 1024).toFixed(2)} KB`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
