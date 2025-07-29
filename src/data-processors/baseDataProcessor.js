/**
 * Base Data Processor
 * 
 * Provides common functionality for data processing operations
 */

class BaseDataProcessor {
  /**
   * Creates a new BaseDataProcessor
   * @param {string} processorName - Name of the processor for logging
   */
  constructor(processorName) {
    this.processorName = processorName;
  }

  /**
   * Logs a message with the processor name
   * @param {string} message - Message to log
   * @param {string} level - Log level (info, warn, error)
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${this.processorName}: ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Validates that input data is a Map
   * @param {*} data - Data to validate
   * @param {string} dataName - Name of the data for error messages
   * @returns {boolean} True if valid, false otherwise
   */
  validateMapInput(data, dataName) {
    if (!(data instanceof Map)) {
      this.log(`Invalid input: ${dataName} is not a Map. Received: ${typeof data}`, 'error');
      return false;
    }
    return true;
  }

  /**
   * Safely gets data from a Map with logging
   * @param {Map} dataMap - Map to get data from
   * @param {*} key - Key to look up
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} The value or default value
   */
  safeMapGet(dataMap, key, defaultValue = null) {
    if (!dataMap || !(dataMap instanceof Map)) {
      this.log(`safeMapGet: Invalid map provided for key ${key}`, 'warn');
      return defaultValue;
    }

    const value = dataMap.get(key);
    if (value === undefined) {
      this.log(`safeMapGet: Key ${key} not found in map`, 'warn');
      return defaultValue;
    }

    return value;
  }

  /**
   * Creates a deep copy of a Map
   * @param {Map} originalMap - Map to copy
   * @returns {Map} Deep copy of the map
   */
  deepCopyMap(originalMap) {
    if (!(originalMap instanceof Map)) {
      this.log('deepCopyMap: Input is not a Map', 'error');
      return new Map();
    }

    const newMap = new Map();
    originalMap.forEach((value, key) => {
      newMap.set(key, deepClone(value));
    });

    return newMap;
  }

  /**
   * Merges multiple data objects for a student
   * @param {Object} baseData - Base student data object
   * @param {Array} additionalData - Array of additional data objects to merge
   * @returns {Object} Merged student data object
   */
  mergeStudentData(baseData, additionalData = []) {
    let merged = deepClone(baseData) || {};

    additionalData.forEach((data, index) => {
      if (data && typeof data === 'object') {
        Object.assign(merged, data);
      } else {
        this.log(`mergeStudentData: Invalid data at index ${index}`, 'warn');
      }
    });

    return merged;
  }

  /**
   * Abstract method to be implemented by subclasses
   * @param {*} inputData - Input data to process
   * @returns {*} Processed data
   */
  process(inputData) {
    throw new Error(`${this.processorName}: process() method must be implemented by subclass`);
  }
}
