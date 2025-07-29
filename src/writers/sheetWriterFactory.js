/**
 * Factory class for creating and managing different sheet writers.
 * Provides a centralized way to get writer instances.
 */
class SheetWriterFactory {
  constructor() {
    this.writers = new Map();
  }

  /**
   * Gets a writer instance for the specified sheet type.
   * @param {string} writerType - The type of writer to get
   * @returns {BaseSheetWriter} The writer instance
   */
  getWriter(writerType) {
    // Return cached instance if available
    if (this.writers.has(writerType)) {
      return this.writers.get(writerType);
    }

    // Create new instance based on type
    let writer;
    switch (writerType.toLowerCase()) {
      case 'tentative':
      case 'tentative-version2':
        writer = new TentativeSheetWriter();
        break;
      
      // Add more writer types as needed in the future
      case 'contact':
        writer = new BaseSheetWriter(SHEET_NAMES.CONTACT_INFO);
        break;
        
      case 'schedules':
        writer = new BaseSheetWriter(SHEET_NAMES.SCHEDULES);
        break;
        
      default:
        throw new Error(`Unknown writer type: ${writerType}`);
    }

    // Cache the instance
    this.writers.set(writerType, writer);
    return writer;
  }

  /**
   * Clears all cached writer instances.
   * Useful for testing or when sheet configurations change.
   */
  clearCache() {
    this.writers.clear();
  }

  /**
   * Gets all available writer types.
   * @returns {Array<string>} Array of available writer types
   */
  getAvailableWriterTypes() {
    return [
      'tentative',
      'tentative-version2',
      'contact',
      'schedules'
    ];
  }
}

// Create and export singleton instance
const sheetWriterFactory = new SheetWriterFactory();
