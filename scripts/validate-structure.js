const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

/**
 * Documentation validation and structure checker
 */
class DocumentationValidator {
  constructor() {
    this.docsPath = path.join(__dirname, '../docs');
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      totalWords: 0,
      totalCodeBlocks: 0,
      totalLinks: 0,
      brokenLinks: 0,
    };
  }

  /**
   * Validate documentation structure
   */
  async validateStructure() {
    console.log('🔍 Validating documentation structure...');

    // Check required directories
    const requiredDirs = [
      'health',
      'fhir-r5',
      'api-reference',
      'platform',
      'operations',
      'contributing',
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(this.docsPath, dir);
      if (!fs.existsSync(dirPath)) {
        this.errors.push(`Missing required directory: ${dir}`);
      } else {
        console.log(`✅ Directory exists: ${dir}`);
      }
    }

    // Check required files
    const requiredFiles = ['intro.md', 'README.md'];

    for (const file of requiredFiles) {
      const filePath = path.join(this.docsPath, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing required file: ${file}`);
      } else {
        console.log(`✅ File exists: ${file}`);
      }
    }

    // Validate category files
    await this.validateCategoryFiles();

    // Validate frontmatter
    await this.validateFrontmatter();

    // Validate internal links
    await this.validateInternalLinks();

    // Generate statistics
    await this.generateStatistics();

    return {
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats,
    };
  }

  /**
   * Validate _category_.json files
   */
  async validateCategoryFiles() {
    console.log('📁 Validating category files...');

    const categories = await this.findFiles(this.docsPath, '_category_.json');

    for (const categoryFile of categories) {
      try {
        const content = fs.readFileSync(categoryFile, 'utf8');
        const category = JSON.parse(content);

        // Validate required fields
        if (!category.label) {
          this.errors.push(`Missing label in ${categoryFile}`);
        }

        if (typeof category.position !== 'number') {
          this.warnings.push(`Missing position in ${categoryFile}`);
        }

        if (!category.link || !category.link.type) {
          this.warnings.push(`Missing link configuration in ${categoryFile}`);
        }

        console.log(`✅ Category file valid: ${path.relative(this.docsPath, categoryFile)}`);
      } catch (error) {
        this.errors.push(`Invalid JSON in ${categoryFile}: ${error.message}`);
      }
    }
  }

  /**
   * Validate frontmatter in markdown files
   */
  async validateFrontmatter() {
    console.log('📝 Validating frontmatter...');

    const markdownFiles = await this.findFiles(this.docsPath, '*.md');

    for (const file of markdownFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const frontmatter = this.extractFrontmatter(content);

        if (!frontmatter) {
          this.warnings.push(`Missing frontmatter in ${path.relative(this.docsPath, file)}`);
          continue;
        }

        // Validate required frontmatter fields
        const requiredFields = ['title', 'description'];

        for (const field of requiredFields) {
          if (!frontmatter[field]) {
            this.warnings.push(
              `Missing frontmatter field '${field}' in ${path.relative(this.docsPath, file)}`
            );
          }
        }

        // Validate title format
        if (frontmatter.title && typeof frontmatter.title !== 'string') {
          this.errors.push(`Invalid title format in ${path.relative(this.docsPath, file)}`);
        }

        console.log(`✅ Frontmatter valid: ${path.relative(this.docsPath, file)}`);
      } catch (error) {
        this.errors.push(`Error processing ${file}: ${error.message}`);
      }
    }
  }

  /**
   * Validate internal links
   */
  async validateInternalLinks() {
    console.log('🔗 Validating internal links...');

    const markdownFiles = await this.findFiles(this.docsPath, '*.md');

    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const links = this.extractLinks(content);

      for (const link of links) {
        if (link.startsWith('./') || link.startsWith('../')) {
          // Internal link - check if target exists
          const targetPath = path.resolve(path.dirname(file), link);

          if (!fs.existsSync(targetPath)) {
            this.errors.push(
              `Broken internal link in ${path.relative(this.docsPath, file)}: ${link}`
            );
            this.stats.brokenLinks++;
          }
        } else if (link.startsWith('http://') || link.startsWith('https://')) {
          // External link - check if accessible
          try {
            const response = await axios.head(link, { timeout: 5000 });
            if (response.status >= 400) {
              this.warnings.push(
                `External link returned ${response.status} in ${path.relative(this.docsPath, file)}: ${link}`
              );
            }
          } catch (error) {
            this.warnings.push(
              `External link inaccessible in ${path.relative(this.docsPath, file)}: ${link}`
            );
          }
        }

        this.stats.totalLinks++;
      }
    }

    console.log(`✅ Validated ${this.stats.totalLinks} links`);
  }

  /**
   * Generate documentation statistics
   */
  async generateStatistics() {
    console.log('📊 Generating statistics...');

    const markdownFiles = await this.findFiles(this.docsPath, '*.md');

    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');

      this.stats.totalFiles++;
      this.stats.totalWords += this.countWords(content);
      this.stats.totalCodeBlocks += (content.match(/```/g) || []).length / 2;
    }

    console.log(`📈 Statistics:`);
    console.log(`   Total files: ${this.stats.totalFiles}`);
    console.log(`   Total words: ${this.stats.totalWords.toLocaleString()}`);
    console.log(`   Total code blocks: ${this.stats.totalCodeBlocks}`);
    console.log(`   Total links: ${this.stats.totalLinks}`);
    console.log(`   Broken links: ${this.stats.brokenLinks}`);
  }

  /**
   * Find files matching pattern
   */
  async findFiles(dir, pattern) {
    const files = [];

    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (item.match(pattern.replace('*', '.*'))) {
          files.push(fullPath);
        }
      }
    };

    walk(dir);
    return files;
  }

  /**
   * Extract frontmatter from markdown content
   */
  extractFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) return null;

    try {
      return require('js-yaml').load(match[1]);
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract links from markdown content
   */
  extractLinks(content) {
    const links = [];

    // Extract markdown links [text](url)
    const markdownLinks = content.match(/\[([^\]]*)\]\(([^)]+)\)/g) || [];
    for (const link of markdownLinks) {
      const match = link.match(/\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        links.push(match[2]);
      }
    }

    // Extract reference links [text][ref]
    const referenceLinks = content.match(/\[([^\]]+)\]\[([^\]]+)\]/g) || [];
    for (const link of referenceLinks) {
      const match = link.match(/\[([^\]]+)\]\[([^\]]+)\]/);
      if (match) {
        links.push(match[2]);
      }
    }

    return links;
  }

  /**
   * Count words in content
   */
  countWords(content) {
    // Remove frontmatter and code blocks
    const cleanContent = content
      .replace(/^---[\s\S]*?---/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '');

    return cleanContent.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        status: this.errors.length === 0 ? 'PASSED' : 'FAILED',
      },
      errors: this.errors,
      warnings: this.warnings,
      statistics: this.stats,
    };

    return report;
  }
}

// Export for use in test files
module.exports = DocumentationValidator;

// Run validation if called directly
if (require.main === module) {
  const validator = new DocumentationValidator();

  validator
    .validateStructure()
    .then((result) => {
      const report = validator.generateReport();

      console.log('\n📋 Validation Report:');
      console.log(`   Status: ${report.summary.status}`);
      console.log(`   Errors: ${report.summary.totalErrors}`);
      console.log(`   Warnings: ${report.summary.totalWarnings}`);

      if (report.summary.totalErrors > 0) {
        console.log('\n❌ Errors:');
        report.errors.forEach((error) => console.log(`   - ${error}`));
        process.exit(1);
      }

      if (report.summary.totalWarnings > 0) {
        console.log('\n⚠️  Warnings:');
        report.warnings.forEach((warning) => console.log(`   - ${warning}`));
      }

      console.log('\n✅ Documentation validation passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}
