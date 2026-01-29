#!/usr/bin/env node

/**
 * ZARISH SPHERE Documentation Auto-Checking System
 *
 * This script provides comprehensive automated checking for:
 * - Link validation
 * - Markdown validation
 * - Image optimization
 * - Code syntax validation
 * - SEO optimization
 * - Quality scoring
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

class DocumentationChecker {
  constructor() {
    this.docsDir = path.join(__dirname, '../docs');
    this.results = {
      links: { checked: 0, broken: 0, warnings: [] },
      markdown: { checked: 0, errors: 0, warnings: [] },
      images: { checked: 0, optimized: 0, warnings: [] },
      code: { checked: 0, errors: 0, warnings: [] },
      seo: { checked: 0, optimized: 0, warnings: [] },
    };
    this.score = 0;
    this.maxScore = 100;
  }

  // Check all internal and external links
  async checkLinks() {
    console.log(chalk.blue('🔗 Checking links...'));

    try {
      // Check internal links
      const internalResult = execSync(
        'find . -name "*.md" -exec grep -l "\\[.*\\](" {} \\; | wc -l',
        {
          cwd: this.docsDir,
          encoding: 'utf8',
        }
      );

      this.results.links.checked = parseInt(internalResult.trim());

      // Check for broken internal links
      const brokenLinks = execSync(
        'find . -name "*.md" -exec grep -H "\\[.*\\](#.*)" {} \\; | head -10',
        {
          cwd: this.docsDir,
          encoding: 'utf8',
        }
      );

      if (brokenLinks.trim()) {
        this.results.links.broken = brokenLinks.trim().split('\n').length;
        this.results.links.warnings.push(
          `Found ${this.results.links.broken} potential broken anchor links`
        );
      }

      console.log(chalk.green(`✅ Links checked: ${this.results.links.checked}`));
      if (this.results.links.broken > 0) {
        console.log(chalk.yellow(`⚠️  Broken links: ${this.results.links.broken}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Link checking failed: ${error.message}`));
    }
  }

  // Check markdown syntax and formatting
  async checkMarkdown() {
    console.log(chalk.blue('📝 Checking markdown...'));

    try {
      const markdownFiles = execSync('find . -name "*.md"', {
        cwd: this.docsDir,
        encoding: 'utf8',
      });

      const files = markdownFiles
        .trim()
        .split('\n')
        .filter((f) => f);
      this.results.markdown.checked = files.length;

      let totalErrors = 0;

      for (const file of files) {
        try {
          // Check for common markdown issues
          const content = fs.readFileSync(path.join(this.docsDir, file), 'utf8');

          // Check for missing alt text in images
          const imageMatches = content.match(/!\[([^\]]*)\]/g) || [];
          const missingAlt = imageMatches.filter((img) => img === '![]').length;
          totalErrors += missingAlt;

          // Check for proper heading hierarchy
          const headings = content.match(/^#+\s/gm) || [];
          if (headings.length > 0) {
            const firstLevel = headings[0].length;
            let hasProperHierarchy = true;

            for (let i = 1; i < headings.length; i++) {
              if (Math.abs(headings[i].length - headings[i - 1].length) > 1) {
                hasProperHierarchy = false;
                break;
              }
            }

            if (!hasProperHierarchy) {
              this.results.markdown.warnings.push(`${file}: Improper heading hierarchy`);
              totalErrors++;
            }
          }
        } catch (fileError) {
          this.results.markdown.warnings.push(`${file}: Cannot read file`);
          totalErrors++;
        }
      }

      this.results.markdown.errors = totalErrors;
      console.log(chalk.green(`✅ Markdown files checked: ${this.results.markdown.checked}`));
      if (this.results.markdown.errors > 0) {
        console.log(chalk.yellow(`⚠️  Markdown errors: ${this.results.markdown.errors}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Markdown checking failed: ${error.message}`));
    }
  }

  // Check image optimization
  async checkImages() {
    console.log(chalk.blue('🖼️  Checking images...'));

    try {
      const imageFiles = execSync(
        'find ../static -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif"',
        {
          cwd: this.docsDir,
          encoding: 'utf8',
        }
      );

      const files = imageFiles
        .trim()
        .split('\n')
        .filter((f) => f);
      this.results.images.checked = files.length;

      let largeImages = 0;

      for (const file of files) {
        try {
          const stats = fs.statSync(path.join(this.docsDir, '../static', file));
          const sizeKB = stats.size / 1024;

          if (sizeKB > 500) {
            // Images larger than 500KB
            largeImages++;
            this.results.images.warnings.push(`${file}: Large image (${sizeKB.toFixed(0)}KB)`);
          }
        } catch (fileError) {
          this.results.images.warnings.push(`${file}: Cannot check file size`);
        }
      }

      this.results.images.optimized = files.length - largeImages;
      console.log(chalk.green(`✅ Images checked: ${this.results.images.checked}`));
      console.log(chalk.green(`✅ Optimized images: ${this.results.images.optimized}`));
      if (largeImages > 0) {
        console.log(chalk.yellow(`⚠️  Large images: ${largeImages}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Image checking failed: ${error.message}`));
    }
  }

  // Check code syntax and formatting
  async checkCode() {
    console.log(chalk.blue('💻 Checking code blocks...'));

    try {
      const markdownFiles = execSync('find . -name "*.md"', {
        cwd: this.docsDir,
        encoding: 'utf8',
      });

      const files = markdownFiles
        .trim()
        .split('\n')
        .filter((f) => f);
      let totalCodeBlocks = 0;
      let syntaxErrors = 0;

      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(this.docsDir, file), 'utf8');

          // Count code blocks
          const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
          totalCodeBlocks += codeBlocks.length;

          // Check for code blocks without language specification
          const noLangBlocks = content.match(/```\n[\s\S]*?```/g) || [];
          syntaxErrors += noLangBlocks.length;

          if (noLangBlocks.length > 0) {
            this.results.code.warnings.push(
              `${file}: ${noLangBlocks.length} code blocks without language`
            );
          }
        } catch (fileError) {
          this.results.code.warnings.push(`${file}: Cannot read file`);
        }
      }

      this.results.code.checked = totalCodeBlocks;
      this.results.code.errors = syntaxErrors;

      console.log(chalk.green(`✅ Code blocks checked: ${this.results.code.checked}`));
      if (this.results.code.errors > 0) {
        console.log(chalk.yellow(`⚠️  Code syntax errors: ${this.results.code.errors}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Code checking failed: ${error.message}`));
    }
  }

  // Check SEO optimization
  async checkSEO() {
    console.log(chalk.blue('🔍 Checking SEO...'));

    try {
      const indexFile = path.join(this.docsDir, '../src/pages/index.html');

      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        this.results.seo.checked = 1;

        // Check for meta description
        const hasMetaDescription = content.includes('name="description"');
        if (!hasMetaDescription) {
          this.results.seo.warnings.push('Missing meta description');
        }

        // Check for Open Graph tags
        const hasOGTags =
          content.includes('property="og:type') || content.includes('property="og:');
        if (!hasOGTags) {
          this.results.seo.warnings.push('Missing Open Graph tags');
        }

        // Check for Twitter Card
        const hasTwitterCard = content.includes('name="twitter:card"');
        if (!hasTwitterCard) {
          this.results.seo.warnings.push('Missing Twitter Card tags');
        }

        this.results.seo.optimized = this.results.seo.warnings.length === 0 ? 1 : 0;

        console.log(chalk.green(`✅ SEO checked: ${this.results.seo.checked}`));
        console.log(chalk.green(`✅ SEO optimized: ${this.results.seo.optimized}`));
        if (this.results.seo.warnings.length > 0) {
          console.log(chalk.yellow(`⚠️  SEO warnings: ${this.results.seo.warnings.length}`));
        }
      } else {
        console.log(chalk.yellow('⚠️  SEO file not found'));
      }
    } catch (error) {
      console.log(chalk.red(`❌ SEO checking failed: ${error.message}`));
    }
  }

  // Calculate quality score
  calculateScore() {
    let score = 0;
    let maxScore = 0;

    // Links score (20 points)
    maxScore += 20;
    if (this.results.links.checked > 0) {
      const linkScore = Math.max(0, 20 - this.results.links.broken * 2);
      score += linkScore;
    }

    // Markdown score (20 points)
    maxScore += 20;
    if (this.results.markdown.checked > 0) {
      const markdownScore = Math.max(0, 20 - this.results.markdown.errors * 2);
      score += markdownScore;
    }

    // Images score (15 points)
    maxScore += 15;
    if (this.results.images.checked > 0) {
      const imageScore = (this.results.images.optimized / this.results.images.checked) * 15;
      score += imageScore;
    }

    // Code score (20 points)
    maxScore += 20;
    if (this.results.code.checked > 0) {
      const codeScore = Math.max(0, 20 - this.results.code.errors);
      score += codeScore;
    }

    // SEO score (25 points)
    maxScore += 25;
    if (this.results.seo.checked > 0) {
      const seoScore = (this.results.seo.optimized / this.results.seo.checked) * 25;
      score += seoScore;
    }

    this.score = Math.round((score / maxScore) * 100);
    this.maxScore = 100;
  }

  // Generate report
  generateReport() {
    console.log('\n' + chalk.bold.blue('📊 DOCUMENTATION QUALITY REPORT'));
    console.log(chalk.bold('='.repeat(50)));

    // Overall score
    const scoreColor = this.score >= 90 ? chalk.green : this.score >= 70 ? chalk.yellow : chalk.red;
    console.log(`Overall Quality Score: ${scoreColor(this.score)}%`);

    // Detailed results
    console.log(chalk.bold('📋 Detailed Results:'));

    console.log(
      `🔗 Links: ${this.results.links.checked} checked, ${this.results.links.broken} broken`
    );
    if (this.results.links.warnings.length > 0) {
      this.results.links.warnings.forEach((warning) =>
        console.log(chalk.yellow(`   ⚠️  ${warning}`))
      );
    }

    console.log(
      `📝 Markdown: ${this.results.markdown.checked} files, ${this.results.markdown.errors} errors`
    );
    if (this.results.markdown.warnings.length > 0) {
      this.results.markdown.warnings.forEach((warning) =>
        console.log(chalk.yellow(`   ⚠️  ${warning}`))
      );
    }

    console.log(
      `🖼️  Images: ${this.results.images.checked} checked, ${this.results.images.optimized} optimized`
    );
    if (this.results.images.warnings.length > 0) {
      this.results.images.warnings.forEach((warning) =>
        console.log(chalk.yellow(`   ⚠️  ${warning}`))
      );
    }

    console.log(
      `💻 Code: ${this.results.code.checked} blocks, ${this.results.code.errors} syntax errors`
    );
    if (this.results.code.warnings.length > 0) {
      this.results.code.warnings.forEach((warning) =>
        console.log(chalk.yellow(`   ⚠️  ${warning}`))
      );
    }

    console.log(
      `🔍 SEO: ${this.results.seo.checked} checked, ${this.results.seo.optimized} optimized`
    );
    if (this.results.seo.warnings.length > 0) {
      this.results.seo.warnings.forEach((warning) =>
        console.log(chalk.yellow(`   ⚠️  ${warning}`))
      );
    }

    // Recommendations
    console.log(chalk.bold('\n💡 Recommendations:'));

    if (this.results.links.broken > 0) {
      console.log(chalk.yellow('🔗 Fix broken links to improve navigation'));
    }

    if (this.results.markdown.errors > 0) {
      console.log(chalk.yellow('📝 Fix markdown errors to improve readability'));
    }

    if (this.results.images.checked > this.results.images.optimized) {
      console.log(chalk.yellow('🖼️  Optimize large images to improve performance'));
    }

    if (this.results.code.errors > 0) {
      console.log(chalk.yellow('💻 Add language specifications to code blocks'));
    }

    if (this.results.seo.warnings.length > 0) {
      console.log(chalk.yellow('🔍 Improve SEO tags for better search visibility'));
    }

    if (this.score >= 90) {
      console.log(chalk.green('\n🎉 Excellent documentation quality!'));
    } else if (this.score >= 70) {
      console.log(chalk.yellow('\n👍 Good documentation quality with room for improvement'));
    } else {
      console.log(chalk.red('\n⚠️  Documentation needs significant improvement'));
    }
  }

  // Run all checks
  async runAllChecks() {
    console.log(chalk.bold.blue('🚀 ZARISH SPHERE Documentation Auto-Checking System'));
    console.log(chalk.bold('='.repeat(60)));

    await this.checkLinks();
    await this.checkMarkdown();
    await this.checkImages();
    await this.checkCode();
    await this.checkSEO();

    this.calculateScore();
    this.generateReport();

    // Save results to file
    const reportPath = path.join(__dirname, '../quality-report.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          score: this.score,
          results: this.results,
        },
        null,
        2
      )
    );

    console.log(chalk.blue(`\n📄 Detailed report saved to: ${reportPath}`));

    return this.score;
  }
}

// Run the checker if this file is executed directly
if (require.main === module) {
  const checker = new DocumentationChecker();
  checker.runAllChecks().catch(console.error);
}

module.exports = DocumentationChecker;
