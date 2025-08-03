/**
 * @fileoverview Sheet Writer Factory for the NAHS system.
 * 
 * This module provides a factory pattern implementation for creating and
 * managing different sheet writer instances in the NAHS system. It offers
 * centralized writer management with caching, instance reuse, and type-safe
 * writer creation for all sheet writing operations.
 * 
 * The factory ensures consistent writer instantiation and provides a clean
 * interface for accessing specialized writers throughout the system.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2024-01-01
 * @memberof Writers
 */

/**
 * Factory class for creating and managing sheet writer instances.
 * 
 * This factory provides centralized management of sheet writer instances
 * with caching capabilities to optimize performance and ensure consistent
 * writer behavior across the system. It implements the factory pattern
 * to abstract writer creation and management.
 * 
 * **Key Features:**
 * - **Instance Caching**: Reuses writer instances for optimal performance
 * - **Type-Safe Creation**: Ensures correct writer types are instantiated
 * - **Centralized Management**: Single point for all writer instance access
 * - **Extensible Design**: Easy addition of new writer types
 * - **Memory Optimization**: Efficient instance lifecycle management
 * 
 * @class SheetWriterFactory
 * @memberof Writers
 * 
 * @example
 * // Get a tentative sheet writer
 * const factory = new SheetWriterFactory();
 * const writer = factory.getWriter('tentative');
 * writer.writeStudentData(studentDataMap);
 * 
 * @example
 * // Use factory with caching
 * const factory = new SheetWriterFactory();
 * const writer1 = factory.getWriter('tentative');
 * const writer2 = factory.getWriter('tentative'); // Returns cached instance
 * console.log(writer1 === writer2); // true
 * 
 * @since 2.0.0
 */
class SheetWriterFactory {
  /**
   * Creates a new SheetWriterFactory instance.
   * 
   * Initializes the factory with an empty writer cache for managing
   * writer instances. The cache ensures efficient reuse of writer
   * instances while maintaining proper isolation between different
   * writer types.
   * 
   * @constructor
   * @memberof SheetWriterFactory
   * 
   * @example
   * // Create factory instance
   * const factory = new SheetWriterFactory();
   * // Ready to create and cache writer instances
   * 
   * @since 2.0.0
   */
  constructor() {
    this.writers = new Map();
  }

  /**
   * Gets a writer instance for the specified sheet type.
   * 
   * This method provides cached writer instances for optimal performance,
   * creating new instances only when necessary. It supports type-safe
   * writer creation and maintains instance consistency across the system.
   * 
   * @function getWriter
   * @memberof SheetWriterFactory
   * 
   * @param {string} writerType - The type of writer to retrieve:
   *   - **'tentative'** or **'tentative-version2'**: TentativeSheetWriter for main output
   *   - **'contact'**: ContactSheetWriter for contact information (future)
   *   - Additional types can be added as system expands
   * @returns {BaseSheetWriter} The writer instance for the specified type
   * 
   * @throws {Error} Throws if unsupported writer type is requested
   * 
   * @example
   * // Get tentative sheet writer
   * const factory = new SheetWriterFactory();
   * const writer = factory.getWriter('tentative');
   * writer.writeStudentData(processedStudentData);
   * 
   * @example
   * // Handle different writer types
   * const factory = new SheetWriterFactory(); 
   * try {
   *   const tentativeWriter = factory.getWriter('tentative');
   *   const contactWriter = factory.getWriter('contact'); // Future implementation
   * } catch (error) {
   *   console.error('Unsupported writer type:', error.message);
   * }
   * 
   * @see {@link TentativeSheetWriter} For tentative sheet writing capabilities
   * @see {@link BaseSheetWriter} For base writer functionality
   * 
   * @since 2.0.0
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
