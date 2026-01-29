const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Uptime monitoring for ZARISH SPHERE documentation
 */
class UptimeMonitor {
  constructor() {
    this.config = {
      baseUrl: process.env.DOCUMENTATION_URL || 'https://docs.zarishsphere.com',
      endpoints: [
        '/',
        '/docs/intro',
        '/docs/fhir-r5/overview',
        '/docs/health/overview',
        '/docs/api-reference/overview',
        '/sitemap.xml',
        '/robots.txt',
      ],
      timeout: 10000,
      retries: 3,
      alertThreshold: 3, // Number of consecutive failures before alerting
      logFile: path.join(__dirname, '../logs/uptime.log'),
      statusFile: path.join(__dirname, '../logs/status.json'),
    };

    this.status = this.loadStatus();
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    const logDir = path.dirname(this.config.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Load previous status
   */
  loadStatus() {
    try {
      if (fs.existsSync(this.config.statusFile)) {
        return JSON.parse(fs.readFileSync(this.config.statusFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load status file:', error.message);
    }

    return {};
  }

  /**
   * Save current status
   */
  saveStatus() {
    try {
      fs.writeFileSync(this.config.statusFile, JSON.stringify(this.status, null, 2));
    } catch (error) {
      console.error('Could not save status file:', error.message);
    }
  }

  /**
   * Log uptime check
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);

    try {
      fs.appendFileSync(this.config.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Could not write to log file:', error.message);
    }
  }

  /**
   * Check single endpoint
   */
  async checkEndpoint(endpoint) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: this.config.timeout,
          validateStatus: (status) => status < 500,
        });

        const responseTime = Date.now() - startTime;

        return {
          endpoint,
          status: 'success',
          statusCode: response.status,
          responseTime,
          attempt,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        if (attempt === this.config.retries) {
          return {
            endpoint,
            status: 'error',
            error: error.message,
            responseTime: Date.now() - startTime,
            attempt,
            timestamp: new Date().toISOString(),
          };
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * Check all endpoints
   */
  async checkAllEndpoints() {
    this.log('Starting uptime monitoring check');

    const results = [];
    const promises = this.config.endpoints.map((endpoint) => this.checkEndpoint(endpoint));

    try {
      const checkResults = await Promise.all(promises);
      results.push(...checkResults);
    } catch (error) {
      this.log(`Error during endpoint checks: ${error.message}`);
    }

    // Update status
    this.updateStatus(results);

    // Check for alerts
    await this.checkAlerts(results);

    // Save status
    this.saveStatus();

    return results;
  }

  /**
   * Update status with new results
   */
  updateStatus(results) {
    const timestamp = new Date().toISOString();

    results.forEach((result) => {
      const key = result.endpoint;

      if (!this.status[key]) {
        this.status[key] = {
          checks: [],
          consecutiveFailures: 0,
          lastSuccess: null,
          lastFailure: null,
          totalChecks: 0,
          totalFailures: 0,
          averageResponseTime: 0,
        };
      }

      const endpointStatus = this.status[key];
      endpointStatus.checks.push(result);
      endpointStatus.totalChecks++;

      // Keep only last 100 checks
      if (endpointStatus.checks.length > 100) {
        endpointStatus.checks = endpointStatus.checks.slice(-100);
      }

      if (result.status === 'success') {
        endpointStatus.consecutiveFailures = 0;
        endpointStatus.lastSuccess = result.timestamp;

        // Update average response time
        const successfulChecks = endpointStatus.checks.filter((c) => c.status === 'success');
        const totalTime = successfulChecks.reduce((sum, c) => sum + c.responseTime, 0);
        endpointStatus.averageResponseTime = Math.round(totalTime / successfulChecks.length);
      } else {
        endpointStatus.consecutiveFailures++;
        endpointStatus.lastFailure = result.timestamp;
        endpointStatus.totalFailures++;
      }
    });

    this.status.lastCheck = timestamp;
  }

  /**
   * Check for alerts
   */
  async checkAlerts(results) {
    const alerts = [];

    results.forEach((result) => {
      const endpointStatus = this.status[result.endpoint];

      if (endpointStatus.consecutiveFailures >= this.config.alertThreshold) {
        alerts.push({
          type: 'endpoint_down',
          endpoint: result.endpoint,
          consecutiveFailures: endpointStatus.consecutiveFailures,
          lastError: result.error,
          lastFailure: endpointStatus.lastFailure,
        });
      }

      // Check for slow response times
      if (result.status === 'success' && result.responseTime > 5000) {
        alerts.push({
          type: 'slow_response',
          endpoint: result.endpoint,
          responseTime: result.responseTime,
        });
      }
    });

    // Send alerts if any
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }

    return alerts;
  }

  /**
   * Send alerts
   */
  async sendAlerts(alerts) {
    const alertMessage = this.formatAlertMessage(alerts);

    // Log alert
    this.log(`ALERT: ${alertMessage}`);

    // Send to Slack if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await this.sendSlackAlert(alertMessage, alerts);
      } catch (error) {
        this.log(`Failed to send Slack alert: ${error.message}`);
      }
    }

    // Send email if configured
    if (process.env.ALERT_EMAIL) {
      try {
        await this.sendEmailAlert(alertMessage, alerts);
      } catch (error) {
        this.log(`Failed to send email alert: ${error.message}`);
      }
    }
  }

  /**
   * Format alert message
   */
  formatAlertMessage(alerts) {
    const endpointAlerts = alerts.filter((a) => a.type === 'endpoint_down');
    const performanceAlerts = alerts.filter((a) => a.type === 'slow_response');

    let message = `🚨 ZARISH SPHERE Documentation Alert\n\n`;

    if (endpointAlerts.length > 0) {
      message += `📴 Endpoints Down:\n`;
      endpointAlerts.forEach((alert) => {
        message += `  • ${alert.endpoint} (${alert.consecutiveFailures} consecutive failures)\n`;
      });
      message += '\n';
    }

    if (performanceAlerts.length > 0) {
      message += `🐌 Slow Response Times:\n`;
      performanceAlerts.forEach((alert) => {
        message += `  • ${alert.endpoint} (${alert.responseTime}ms)\n`;
      });
      message += '\n';
    }

    message += `🔗 ${this.config.baseUrl}\n`;
    message += `⏰ ${new Date().toISOString()}`;

    return message;
  }

  /**
   * Send Slack alert
   */
  async sendSlackAlert(message, alerts) {
    const payload = {
      text: message,
      attachments: [
        {
          color: alerts.some((a) => a.type === 'endpoint_down') ? 'danger' : 'warning',
          fields: [
            {
              title: 'Service',
              value: 'ZARISH SPHERE Documentation',
              short: true,
            },
            {
              title: 'Environment',
              value: process.env.NODE_ENV || 'production',
              short: true,
            },
            {
              title: 'Alerts Count',
              value: alerts.length.toString(),
              short: true,
            },
            {
              title: 'Severity',
              value: alerts.some((a) => a.type === 'endpoint_down') ? 'High' : 'Medium',
              short: true,
            },
          ],
          footer: 'Uptime Monitor',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
  }

  /**
   * Send email alert
   */
  async sendEmailAlert(message, alerts) {
    // Implementation depends on email service provider
    // This is a placeholder for email sending logic
    console.log('Email alert would be sent:', message);
  }

  /**
   * Generate uptime report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.config.baseUrl,
      endpoints: this.config.endpoints.map((endpoint) => {
        const status = this.status[endpoint] || {};
        return {
          endpoint,
          totalChecks: status.totalChecks || 0,
          totalFailures: status.totalFailures || 0,
          consecutiveFailures: status.consecutiveFailures || 0,
          lastSuccess: status.lastSuccess,
          lastFailure: status.lastFailure,
          averageResponseTime: status.averageResponseTime || 0,
          uptime:
            status.totalChecks > 0
              ? (((status.totalChecks - status.totalFailures) / status.totalChecks) * 100).toFixed(
                  2
                ) + '%'
              : 'N/A',
        };
      }),
      summary: {
        totalEndpoints: this.config.endpoints.length,
        healthyEndpoints: this.config.endpoints.filter(
          (e) => (this.status[e] || {}).consecutiveFailures < this.config.alertThreshold
        ).length,
        lastCheck: this.status.lastCheck,
      },
    };

    return report;
  }
}

// Export for use in other modules
module.exports = UptimeMonitor;

// Run monitoring if called directly
if (require.main === module) {
  const monitor = new UptimeMonitor();

  monitor
    .checkAllEndpoints()
    .then((results) => {
      const report = monitor.generateReport();
      console.log('\n📊 Uptime Report:');
      console.log(
        `Healthy endpoints: ${report.summary.healthyEndpoints}/${report.summary.totalEndpoints}`
      );

      results.forEach((result) => {
        const status = result.status === 'success' ? '✅' : '❌';
        const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
        console.log(`${status} ${result.endpoint}${time}`);
      });

      process.exit(0);
    })
    .catch((error) => {
      console.error('Monitoring failed:', error);
      process.exit(1);
    });
}
