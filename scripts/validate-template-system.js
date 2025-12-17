#!/usr/bin/env node

/**
 * Validation script for the centralized template variable system
 * Tests the new architecture without requiring database connection
 */

// Mock imports since we can't run TypeScript directly without building
const validateSystem = () => {
  console.log('🔍 Validating Template Variable System...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };
  
  // Test 1: Check variable registry file exists
  console.log('Test 1: Variable registry file exists');
  const fs = require('fs');
  const path = require('path');
  
  const variablesPath = path.join(__dirname, '../lib/templates/template-variables.ts');
  if (fs.existsSync(variablesPath)) {
    console.log('  ✅ lib/templates/template-variables.ts exists');
    results.passed++;
  } else {
    console.log('  ❌ lib/templates/template-variables.ts NOT FOUND');
    results.failed++;
  }
  
  // Test 2: Check common CSS file exists
  console.log('\nTest 2: Common CSS file exists');
  const cssPath = path.join(__dirname, '../lib/templates/common-template-styles.css');
  if (fs.existsSync(cssPath)) {
    console.log('  ✅ lib/templates/common-template-styles.css exists');
    results.passed++;
    
    // Check CSS file size
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    const cssSize = cssContent.length;
    console.log(`  ℹ️  CSS file size: ${(cssSize / 1024).toFixed(2)} KB`);
    
    // Check for required CSS variables
    const requiredVars = ['--brand-primary', '--brand-secondary', '--brand-accent', '--font-heading', '--font-body'];
    const missingVars = requiredVars.filter(v => !cssContent.includes(v));
    
    if (missingVars.length === 0) {
      console.log('  ✅ All required CSS variables present');
      results.passed++;
    } else {
      console.log(`  ❌ Missing CSS variables: ${missingVars.join(', ')}`);
      results.failed++;
    }
  } else {
    console.log('  ❌ lib/templates/common-template-styles.css NOT FOUND');
    results.failed++;
  }
  
  // Test 3: Check master templates use new structure
  console.log('\nTest 3: Master templates updated');
  const masterPath = path.join(__dirname, '../lib/templates/master-templates.ts');
  if (fs.existsSync(masterPath)) {
    const masterContent = fs.readFileSync(masterPath, 'utf-8');
    
    // Check for variableKeys usage
    if (masterContent.includes('variableKeys:')) {
      console.log('  ✅ Master templates use variableKeys');
      results.passed++;
    } else {
      console.log('  ⚠️  Master templates may not use new structure');
      results.warnings++;
    }
    
    // Check for import of centralized variables
    if (masterContent.includes('template-variables')) {
      console.log('  ✅ Master templates import centralized variables');
      results.passed++;
    } else {
      console.log('  ⚠️  Master templates may not import centralized variables');
      results.warnings++;
    }
  } else {
    console.log('  ❌ lib/templates/master-templates.ts NOT FOUND');
    results.failed++;
  }
  
  // Test 4: Check renderer updated
  console.log('\nTest 4: Renderer updated');
  const rendererPath = path.join(__dirname, '../lib/templates/renderer.ts');
  if (fs.existsSync(rendererPath)) {
    const rendererContent = fs.readFileSync(rendererPath, 'utf-8');
    
    // Check for common CSS loading
    if (rendererContent.includes('getCommonCss') || rendererContent.includes('commonCss')) {
      console.log('  ✅ Renderer loads common CSS');
      results.passed++;
    } else {
      console.log('  ⚠️  Renderer may not load common CSS');
      results.warnings++;
    }
    
    // Check for includeCommonCss option
    if (rendererContent.includes('includeCommonCss')) {
      console.log('  ✅ Renderer has includeCommonCss option');
      results.passed++;
    } else {
      console.log('  ⚠️  Renderer missing includeCommonCss option');
      results.warnings++;
    }
  } else {
    console.log('  ❌ lib/templates/renderer.ts NOT FOUND');
    results.failed++;
  }
  
  // Test 5: Check AI generation updated
  console.log('\nTest 5: AI generation updated');
  const generationPath = path.join(__dirname, '../lib/ai/templates/generation.ts');
  if (fs.existsSync(generationPath)) {
    const generationContent = fs.readFileSync(generationPath, 'utf-8');
    
    // Check for new function
    if (generationContent.includes('populateTemplateByKeys')) {
      console.log('  ✅ AI generation has populateTemplateByKeys function');
      results.passed++;
    } else {
      console.log('  ⚠️  AI generation missing populateTemplateByKeys function');
      results.warnings++;
    }
    
    // Check for centralized variable import
    if (generationContent.includes('generateLlmSchemaFromKeys')) {
      console.log('  ✅ AI generation uses centralized schema generator');
      results.passed++;
    } else {
      console.log('  ⚠️  AI generation may not use centralized schema');
      results.warnings++;
    }
  } else {
    console.log('  ❌ lib/ai/templates/generation.ts NOT FOUND');
    results.failed++;
  }
  
  // Test 6: Check seed script updated
  console.log('\nTest 6: Seed script updated');
  const seedPath = path.join(__dirname, '../scripts/seed-templates.ts');
  if (fs.existsSync(seedPath)) {
    const seedContent = fs.readFileSync(seedPath, 'utf-8');
    
    // Check for centralized variable import
    if (seedContent.includes('generateLlmSchemaFromKeys') || seedContent.includes('validateVariableKeys')) {
      console.log('  ✅ Seed script uses centralized variables');
      results.passed++;
    } else {
      console.log('  ⚠️  Seed script may not use centralized variables');
      results.warnings++;
    }
  } else {
    console.log('  ❌ scripts/seed-templates.ts NOT FOUND');
    results.failed++;
  }
  
  // Test 7: Check documentation exists
  console.log('\nTest 7: Documentation exists');
  const docsPath = path.join(__dirname, '../docs/TEMPLATE_VARIABLE_CONSOLIDATION.md');
  if (fs.existsSync(docsPath)) {
    console.log('  ✅ Documentation file exists');
    results.passed++;
    
    const docsContent = fs.readFileSync(docsPath, 'utf-8');
    const docsSize = docsContent.length;
    console.log(`  ℹ️  Documentation size: ${(docsSize / 1024).toFixed(2)} KB`);
  } else {
    console.log('  ⚠️  Documentation file not found');
    results.warnings++;
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Validation Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed:   ${results.passed}`);
  console.log(`❌ Failed:   ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log('='.repeat(50));
  
  if (results.failed === 0) {
    console.log('\n🎉 All critical tests passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm install (if not already done)');
    console.log('   2. Run: npm run db:seed (to populate templates)');
    console.log('   3. Test template loading in the application');
    return 0;
  } else {
    console.log('\n⚠️  Some critical tests failed. Please review the results above.');
    return 1;
  }
};

// Run validation
const exitCode = validateSystem();
process.exit(exitCode);
