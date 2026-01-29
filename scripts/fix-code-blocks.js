#!/usr/bin/env node

/**
 * Fix Code Blocks Language Specifications
 *
 * This script automatically adds language specifications to code blocks
 * that are missing them in markdown files.
 */

const fs = require('fs');
const path = require('path');

class CodeBlockFixer {
  constructor() {
    this.docsDir = path.join(__dirname, '../docs');
    this.fixedFiles = 0;
    this.totalBlocks = 0;
    this.fixedBlocks = 0;
  }

  // Detect language from code content
  detectLanguage(code) {
    const trimmedCode = code.trim();

    // JavaScript/TypeScript patterns
    if (
      trimmedCode.includes('function') ||
      trimmedCode.includes('const ') ||
      trimmedCode.includes('let ') ||
      trimmedCode.includes('var ') ||
      trimmedCode.includes('=>') ||
      trimmedCode.includes('import ') ||
      trimmedCode.includes('export ')
    ) {
      if (
        trimmedCode.includes('interface ') ||
        trimmedCode.includes('type ') ||
        trimmedCode.includes(': string') ||
        trimmedCode.includes(': number')
      ) {
        return 'typescript';
      }
      return 'javascript';
    }

    // JSON patterns
    if (
      (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) ||
      trimmedCode.includes('"resourceType"')
    ) {
      return 'json';
    }

    // Shell/Bash patterns
    if (
      trimmedCode.includes('#!/bin/bash') ||
      trimmedCode.includes('npm ') ||
      trimmedCode.includes('git ') ||
      trimmedCode.includes('curl ') ||
      trimmedCode.includes('echo ')
    ) {
      return 'bash';
    }

    // SQL patterns
    if (
      trimmedCode.toUpperCase().includes('SELECT ') ||
      trimmedCode.toUpperCase().includes('INSERT ') ||
      trimmedCode.toUpperCase().includes('UPDATE ') ||
      trimmedCode.toUpperCase().includes('DELETE ')
    ) {
      return 'sql';
    }

    // Python patterns
    if (
      trimmedCode.includes('def ') ||
      trimmedCode.includes('import ') ||
      trimmedCode.includes('print(') ||
      trimmedCode.includes('class ')
    ) {
      return 'python';
    }

    // HTML patterns
    if (
      trimmedCode.includes('<!DOCTYPE') ||
      trimmedCode.includes('<html') ||
      trimmedCode.includes('<div') ||
      trimmedCode.includes('<span')
    ) {
      return 'html';
    }

    // CSS patterns
    if (
      trimmedCode.includes('{') &&
      trimmedCode.includes('}') &&
      (trimmedCode.includes('color:') ||
        trimmedCode.includes('background:') ||
        trimmedCode.includes('margin:'))
    ) {
      return 'css';
    }

    // YAML patterns
    if (
      trimmedCode.includes('resourceType:') ||
      trimmedCode.includes('status:') ||
      trimmedCode.includes('version:')
    ) {
      return 'yaml';
    }

    // XML patterns
    if (
      trimmedCode.includes('<?xml') ||
      trimmedCode.includes('<root>') ||
      trimmedCode.includes('</root>')
    ) {
      return 'xml';
    }

    // Default to text if no pattern matches
    return 'text';
  }

  // Fix code blocks in a single file
  fixFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let modified = false;
      let blockCount = 0;
      let fixedCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for code block opening without language
        if (line.trim() === '```') {
          blockCount++;

          // Look ahead to see if there's content and determine language
          let codeContent = '';
          let endIndex = i + 1;

          // Find the end of the code block
          while (endIndex < lines.length && lines[endIndex].trim() !== '```') {
            codeContent += lines[endIndex] + '\n';
            endIndex++;
          }

          // If we have code content, detect the language
          if (codeContent.trim()) {
            const detectedLanguage = this.detectLanguage(codeContent);

            // Replace the opening ``` with ```language
            lines[i] = '```' + detectedLanguage;
            modified = true;
            fixedCount++;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        this.fixedFiles++;
        this.fixedBlocks += fixedCount;
      }

      this.totalBlocks += blockCount;

      return {
        fixed: modified,
        blocks: blockCount,
        fixedBlocks: fixedCount,
      };
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
      return { fixed: false, blocks: 0, fixedBlocks: 0 };
    }
  }

  // Process all markdown files
  async fixAllFiles() {
    console.log('🔧 Fixing code blocks language specifications...\n');

    // Find all markdown files
    const { execSync } = require('child_process');
    const markdownFiles = execSync('find . -name "*.md"', {
      cwd: this.docsDir,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter((f) => f);

    console.log(`📁 Found ${markdownFiles.length} markdown files\n`);

    // Process each file
    for (const file of markdownFiles) {
      const filePath = path.join(this.docsDir, file);
      const result = this.fixFile(filePath);

      if (result.fixed) {
        console.log(`✅ Fixed ${file}: ${result.fixedBlocks}/${result.blocks} blocks`);
      } else if (result.blocks > 0) {
        console.log(`ℹ️  ${file}: ${result.blocks} blocks (no changes needed)`);
      }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`📁 Files processed: ${markdownFiles.length}`);
    console.log(`🔧 Files fixed: ${this.fixedFiles}`);
    console.log(`📝 Total code blocks: ${this.totalBlocks}`);
    console.log(`✅ Fixed blocks: ${this.fixedBlocks}`);

    if (this.fixedBlocks > 0) {
      console.log('\n🎉 Code block language specifications have been added!');
    } else {
      console.log('\n✅ All code blocks already have language specifications!');
    }
  }
}

// Run the fixer if this file is executed directly
if (require.main === module) {
  const fixer = new CodeBlockFixer();
  fixer.fixAllFiles().catch(console.error);
}

module.exports = CodeBlockFixer;
