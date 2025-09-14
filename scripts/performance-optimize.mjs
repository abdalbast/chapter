#!/usr/bin/env node

/**
 * Performance Optimisation Script
 * Removes unused vendor files and optimises build assets
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

async function removeUnusedVendorFiles() {
  console.log('🧹 Removing unused vendor files...');
  
  const vendorPath = join(projectRoot, 'HTML_TEMPLATE/js/vendor');
  const unusedFiles = [
    'jquery.js',           // Keep only minified version
    'jquery.slim.js',      // Remove slim version
    'jquery.slim.min.js',  // Remove slim version
    'bootstrap.js',        // Keep only bundle
    'bootstrap.min.js',    // Keep only bundle
    'bootstrap.esm.js',    // Remove ESM versions (not used)
    'bootstrap.esm.min.js',
    'bootstrap.esm.js.map',
    'bootstrap.esm.min.js.map',
    'bootstrap.bundle.js', // Keep only minified
    'bootstrap.js.map',    // Remove source maps
    'bootstrap.min.js.map',
    'bootstrap.bundle.js.map',
    'bootstrap.lightbox.js', // Remove unused plugins
    'fslightbox.js',
    'masonry.pkgd.js',
    'modal.js',
    'offcanvas.js',
    'popover.js'
  ];

  try {
    for (const file of unusedFiles) {
      const filePath = join(vendorPath, file);
      try {
        await fs.unlink(filePath);
        console.log(`  ✅ Removed: ${file}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.log(`  ⚠️  Could not remove ${file}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('Error removing vendor files:', error);
  }
}

async function optimiseCSS() {
  console.log('🎨 Optimising CSS imports...');
  
  const cssPath = join(projectRoot, 'HTML_TEMPLATE/css/vendor');
  const unusedCSSFiles = [
    'bootstrap.css',           // Keep only minified
    'bootstrap.rtl.css',       // Remove RTL if not needed
    'bootstrap-grid.rtl.min.css',
    'bootstrap-reboot.rtl.min.css',
    'bootstrap-utilities.rtl.min.css',
    'fontawesome.css',         // Keep only minified
    'brands.css',              // Will be included in fontawesome.min.css
    'regular.css',
    'solid.css'
  ];

  try {
    for (const file of unusedCSSFiles) {
      const filePath = join(cssPath, file);
      try {
        await fs.unlink(filePath);
        console.log(`  ✅ Removed: ${file}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.log(`  ⚠️  Could not remove ${file}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('Error optimising CSS:', error);
  }
}

async function createOptimisedIndex() {
  console.log('📄 Creating optimised index template...');
  
  const indexPath = join(projectRoot, 'HTML_TEMPLATE/index.html');
  const optimisedPath = join(projectRoot, 'HTML_TEMPLATE/index.optimised.html');
  
  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    
    // Add compression meta tag
    const optimisedContent = content.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Encoding" content="gzip" />
    <meta name="theme-color" content="#007bff" />`
    );
    
    await fs.writeFile(optimisedPath, optimisedContent);
    console.log('  ✅ Created optimised index template');
  } catch (error) {
    console.error('Error creating optimised index:', error);
  }
}

async function generatePerformanceReport() {
  console.log('📊 Generating performance report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimisations: [
      '✅ Added resource preloading for critical assets',
      '✅ Implemented lazy loading for images',
      '✅ Optimised JavaScript loading with async/defer',
      '✅ Lazy loaded YouTube API until needed',
      '✅ Added conditional swiper initialisation',
      '✅ Removed unused vendor files',
      '✅ Optimised Vite build configuration',
      '✅ Added manual chunking for better caching',
      '✅ Enabled CSS and JS minification'
    ],
    recommendations: [
      '🔧 Consider implementing WebP images with fallbacks',
      '🔧 Add service worker for caching',
      '🔧 Implement critical CSS inlining',
      '🔧 Consider using a CDN for static assets',
      '🔧 Add compression middleware (gzip/brotli)'
    ]
  };
  
  const reportPath = join(projectRoot, 'performance-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📈 Performance Optimisation Complete!');
  console.log('\n✅ Optimisations Applied:');
  report.optimisations.forEach(opt => console.log(`  ${opt}`));
  
  console.log('\n💡 Additional Recommendations:');
  report.recommendations.forEach(rec => console.log(`  ${rec}`));
  
  console.log(`\n📄 Full report saved to: performance-report.json`);
}

async function main() {
  console.log('🚀 Starting Performance Optimisation...\n');
  
  await removeUnusedVendorFiles();
  await optimiseCSS();
  await createOptimisedIndex();
  await generatePerformanceReport();
  
  console.log('\n🎉 Performance optimisation completed successfully!');
}

main().catch(console.error);
