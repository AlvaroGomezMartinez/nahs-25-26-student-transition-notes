/**
 * @fileoverview Services module index for the NAHS system.
 * 
 * This module exports all service classes and functions for the NAHS
 * Student Transition Notes system. Services handle business logic and
 * external integrations like email notifications and data synchronization.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @namespace Services
 */

/**
 * Email Reminder Service for automated teacher notifications.
 * 
 * Handles the automated process of sending reminder emails to teachers
 * when students reach their 10-day enrollment milestone at NAHS.
 * 
 * @see {@link EmailReminderService} For the complete service class
 * @memberof Services
 * @since 2.0.0
 */

// Services are available globally when this file is loaded
// No explicit exports needed in Google Apps Script environment

/**
 * Service initialization and configuration.
 * 
 * This function can be used to initialize all services with common
 * configuration or perform startup tasks.
 * 
 * @function initializeServices
 * @memberof Services
 * 
 * @param {Object} [config={}] - Global service configuration
 * @returns {boolean} Success status of initialization
 * 
 * @example
 * // Initialize services with default configuration
 * const initialized = initializeServices();
 * 
 * @example
 * // Initialize with custom configuration
 * const initialized = initializeServices({
 *   debugMode: true,
 *   timezone: 'America/Chicago'
 * });
 * 
 * @since 2.0.0
 */
function initializeServices(config = {}) {
  try {
    console.log('Initializing NAHS Services...');
    
    // Future service initialization can be added here
    // Example: Database connections, API configurations, etc.
    
    console.log('Services initialized successfully');
    return true;
    
  } catch (error) {
    console.error('Error initializing services:', error);
    return false;
  }
}

/**
 * Service health check for monitoring and diagnostics.
 * 
 * This function checks the health and availability of all services
 * in the system. Useful for diagnostics and monitoring.
 * 
 * @function checkServiceHealth
 * @memberof Services
 * 
 * @returns {Object} Health status of all services
 * 
 * @example
 * // Check service health
 * const health = checkServiceHealth();
 * console.log('Email service health:', health.emailService);
 * 
 * @since 2.0.0
 */
function checkServiceHealth() {
  const healthStatus = {
    emailService: 'unknown',
    overallHealth: 'unknown',
    lastChecked: new Date()
  };
  
  try {
    // Check Email Reminder Service
    const emailService = new EmailReminderService({ debugMode: true });
    healthStatus.emailService = 'healthy';
    
    // Calculate overall health
    healthStatus.overallHealth = healthStatus.emailService === 'healthy' ? 'healthy' : 'degraded';
    
    console.log('Service health check completed:', healthStatus);
    return healthStatus;
    
  } catch (error) {
    console.error('Error during service health check:', error);
    healthStatus.emailService = 'unhealthy';
    healthStatus.overallHealth = 'unhealthy';
    healthStatus.error = error.message;
    
    return healthStatus;
  }
}
