const fs = require('fs');
const path = require('path');
const axios = require('axios');

/**
 * Deployment automation for ZARISH SPHERE documentation
 */
class DeploymentAutomation {
  constructor() {
    this.config = {
      buildDir: path.join(__dirname, '../build'),
      deploymentDir: path.join(__dirname, '../deploy'),
      environments: {
        staging: {
          url: 'https://staging.docs.zarishsphere.com',
          branch: 'develop',
          domain: 'staging.docs.zarishsphere.com',
        },
        production: {
          url: 'https://docs.zarishsphere.com',
          branch: 'main',
          domain: 'docs.zarishsphere.com',
        },
      },
      healthCheckEndpoints: ['/', '/docs/intro', '/docs/fhir-r5/overview', '/sitemap.xml'],
      maxRetries: 3,
      retryDelay: 5000,
    };

    this.deploymentInfo = {
      timestamp: new Date().toISOString(),
      gitSha: process.env.GITHUB_SHA || 'unknown',
      gitBranch: process.env.GITHUB_REF_NAME || 'unknown',
      deployer: process.env.GITHUB_ACTOR || 'system',
    };
  }

  /**
   * Deploy to specified environment
   */
  async deploy(environment = 'staging') {
    console.log(`🚀 Starting deployment to ${environment}...`);

    const envConfig = this.config.environments[environment];
    if (!envConfig) {
      throw new Error(`Unknown environment: ${environment}`);
    }

    try {
      // Pre-deployment checks
      await this.preDeploymentChecks(environment);

      // Build the documentation
      await this.buildDocumentation();

      // Validate build output
      await this.validateBuildOutput();

      // Deploy to environment
      await this.deployToEnvironment(environment);

      // Post-deployment verification
      await this.postDeploymentVerification(environment);

      // Generate deployment report
      const report = await this.generateDeploymentReport(environment, 'success');

      console.log(`✅ Deployment to ${environment} completed successfully!`);
      return report;
    } catch (error) {
      console.error(`❌ Deployment to ${environment} failed:`, error.message);

      // Generate failure report
      const report = await this.generateDeploymentReport(environment, 'failed', error);

      // Attempt rollback if needed
      if (environment === 'production') {
        await this.attemptRollback(environment);
      }

      throw error;
    }
  }

  /**
   * Pre-deployment checks
   */
  async preDeploymentChecks(environment) {
    console.log('🔍 Running pre-deployment checks...');

    // Check if build directory exists
    if (!fs.existsSync(this.config.buildDir)) {
      throw new Error('Build directory not found. Run build first.');
    }

    // Check environment configuration
    const envConfig = this.config.environments[environment];
    if (!envConfig) {
      throw new Error(`Configuration for ${environment} not found`);
    }

    // Check if we're deploying from correct branch
    if (process.env.GITHUB_REF_NAME && process.env.GITHUB_REF_NAME !== envConfig.branch) {
      console.warn(
        `⚠️  Warning: Deploying from ${process.env.GITHUB_REF_NAME} to ${environment} (expected ${envConfig.branch})`
      );
    }

    // Check for required environment variables
    const requiredVars = ['GITHUB_TOKEN'];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Required environment variable ${varName} not set`);
      }
    }

    console.log('✅ Pre-deployment checks passed');
  }

  /**
   * Build documentation
   */
  async buildDocumentation() {
    console.log('📦 Building documentation...');

    const { execSync } = require('child_process');

    try {
      // Clean previous build
      if (fs.existsSync(this.config.buildDir)) {
        fs.rmSync(this.config.buildDir, { recursive: true });
      }

      // Build documentation
      execSync('npm run build', { stdio: 'inherit' });

      // Verify build output
      if (!fs.existsSync(this.config.buildDir)) {
        throw new Error('Build failed - no output directory found');
      }

      console.log('✅ Documentation built successfully');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Validate build output
   */
  async validateBuildOutput() {
    console.log('🔍 Validating build output...');

    const requiredFiles = ['index.html', 'sitemap.xml', 'robots.txt'];

    for (const file of requiredFiles) {
      const filePath = path.join(this.config.buildDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing from build: ${file}`);
      }
    }

    // Check for critical pages
    const criticalPages = [
      'docs/intro/index.html',
      'docs/fhir-r5/overview/index.html',
      'docs/health/overview/index.html',
    ];

    for (const page of criticalPages) {
      const filePath = path.join(this.config.buildDir, page);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Critical page missing: ${page}`);
      }
    }

    console.log('✅ Build output validation passed');
  }

  /**
   * Deploy to environment
   */
  async deployToEnvironment(environment) {
    console.log(`📤 Deploying to ${environment}...`);

    const envConfig = this.config.environments[environment];

    // Create deployment directory
    if (!fs.existsSync(this.config.deploymentDir)) {
      fs.mkdirSync(this.config.deploymentDir, { recursive: true });
    }

    const envDeployDir = path.join(this.config.deploymentDir, environment);
    if (fs.existsSync(envDeployDir)) {
      fs.rmSync(envDeployDir, { recursive: true });
    }
    fs.mkdirSync(envDeployDir, { recursive: true });

    // Copy build files to deployment directory
    this.copyDirectory(this.config.buildDir, envDeployDir);

    // Create deployment metadata
    const metadata = {
      ...this.deploymentInfo,
      environment,
      url: envConfig.url,
      domain: envConfig.domain,
      files: this.getDirectoryFiles(envDeployDir),
    };

    fs.writeFileSync(path.join(envDeployDir, 'deployment.json'), JSON.stringify(metadata, null, 2));

    // For GitHub Pages deployment
    if (environment === 'production') {
      await this.deployToGitHubPages();
    }

    console.log(`✅ Deployment to ${environment} completed`);
  }

  /**
   * Deploy to GitHub Pages
   */
  async deployToGitHubPages() {
    console.log('📄 Deploying to GitHub Pages...');

    const { execSync } = require('child_process');

    try {
      // Configure git user
      execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' });
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', {
        stdio: 'inherit',
      });

      // Deploy using gh-pages
      execSync(
        `npx gh-pages --dist ${this.config.buildDir} --dotfiles --message "Deploy documentation [${this.deploymentInfo.gitSha}]"`,
        { stdio: 'inherit' }
      );

      console.log('✅ GitHub Pages deployment completed');
    } catch (error) {
      throw new Error(`GitHub Pages deployment failed: ${error.message}`);
    }
  }

  /**
   * Post-deployment verification
   */
  async postDeploymentVerification(environment) {
    console.log(`🔍 Verifying ${environment} deployment...`);

    const envConfig = this.config.environments[environment];

    // Wait for deployment to propagate
    console.log('⏳ Waiting for deployment to propagate...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Health checks
    for (const endpoint of this.config.healthCheckEndpoints) {
      const url = `${envConfig.url}${endpoint}`;

      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
          const response = await axios.get(url, {
            timeout: 10000,
            validateStatus: (status) => status < 500,
          });

          if (response.status >= 200 && response.status < 300) {
            console.log(`✅ Health check passed: ${url}`);
            break;
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          if (attempt === this.config.maxRetries) {
            throw new Error(`Health check failed for ${url}: ${error.message}`);
          }

          console.log(`⚠️  Health check attempt ${attempt} failed for ${url}, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));
        }
      }
    }

    console.log('✅ Post-deployment verification completed');
  }

  /**
   * Attempt rollback
   */
  async attemptRollback(environment) {
    console.log(`🔄 Attempting rollback for ${environment}...`);

    try {
      // This would implement rollback logic
      // For now, just log the attempt
      console.log('⚠️  Rollback functionality not implemented');
    } catch (error) {
      console.error(`Rollback failed: ${error.message}`);
    }
  }

  /**
   * Generate deployment report
   */
  async generateDeploymentReport(environment, status, error = null) {
    const report = {
      deployment: {
        ...this.deploymentInfo,
        environment,
        status,
        url: this.config.environments[environment].url,
        timestamp: new Date().toISOString(),
      },
      build: {
        directory: this.config.buildDir,
        size: this.getDirectorySize(this.config.buildDir),
        files: this.getDirectoryFiles(this.config.buildDir).length,
      },
      verification: {
        healthChecks: this.config.healthCheckEndpoints,
        status: status === 'success' ? 'passed' : 'failed',
      },
    };

    if (error) {
      report.error = {
        message: error.message,
        stack: error.stack,
      };
    }

    // Save report
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFile = path.join(reportsDir, `deployment-${environment}-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log(`📋 Deployment report saved: ${reportFile}`);

    return report;
  }

  /**
   * Copy directory recursively
   */
  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  /**
   * Get directory files recursively
   */
  getDirectoryFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.getDirectoryFiles(filePath, fileList);
      } else {
        fileList.push(path.relative(dir, filePath));
      }
    });

    return fileList;
  }

  /**
   * Get directory size
   */
  getDirectorySize(dir) {
    let totalSize = 0;

    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        totalSize += this.getDirectorySize(filePath);
      } else {
        totalSize += stat.size;
      }
    });

    return totalSize;
  }
}

// Export for use in other modules
module.exports = DeploymentAutomation;

// Run deployment if called directly
if (require.main === module) {
  const deployment = new DeploymentAutomation();
  const environment = process.argv[2] || 'staging';

  deployment
    .deploy(environment)
    .then((report) => {
      console.log('\n📊 Deployment Summary:');
      console.log(`Environment: ${report.deployment.environment}`);
      console.log(`Status: ${report.deployment.status}`);
      console.log(`URL: ${report.deployment.url}`);
      console.log(`Files: ${report.build.files}`);
      console.log(`Size: ${(report.build.size / 1024 / 1024).toFixed(2)} MB`);

      process.exit(0);
    })
    .catch((error) => {
      console.error('Deployment failed:', error);
      process.exit(1);
    });
}
