/**
 * @fileoverview Auto-Update Management for NAHS system.
 * 
 * This module provides functionality to set up automatic triggers
 * that detect when Form Responses 1 is updated and can automatically
 * refresh the TENTATIVE-Version2 sheet.
 * 
 * @author Alvaro Gomez
 * @version 2.0.0
 * @since 2.0.0
 * @memberof Utils
 */

/**
 * Sets up a time-based trigger to check for form updates periodically
 * @param {number} intervalHours - How often to check for updates (in hours)
 */
function setupAutoUpdateTrigger(intervalHours = 6) {
  console.log(`Setting up auto-update trigger to run every ${intervalHours} hours...`);
  
  try {
    // Delete existing triggers for this function to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'autoCheckAndUpdate') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new time-based trigger
    ScriptApp.newTrigger('autoCheckAndUpdate')
      .timeBased()
      .everyHours(intervalHours)
      .create();
    
    console.log('✅ Auto-update trigger created successfully');
    console.log(`⏰ Will check for updates every ${intervalHours} hours`);
    
  } catch (error) {
    console.error('❌ Error setting up trigger:', error.message);
  }
}

/**
 * Removes the auto-update trigger
 */
function removeAutoUpdateTrigger() {
  console.log('Removing auto-update trigger...');
  
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let removedCount = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'autoCheckAndUpdate') {
        ScriptApp.deleteTrigger(trigger);
        removedCount++;
      }
    });
    
    console.log(`✅ Removed ${removedCount} auto-update trigger(s)`);
    
  } catch (error) {
    console.error('❌ Error removing trigger:', error.message);
  }
}

/**
 * Automatic check and update function (called by trigger)
 * This function will be executed automatically based on the schedule
 */
function autoCheckAndUpdate() {
  console.log('🤖 AUTO-UPDATE: Checking for form response updates...');
  
  try {
    const updateInfo = checkForFormResponseUpdates();
    
    if (updateInfo.needsUpdate) {
      console.log('🔄 AUTO-UPDATE: Updates detected, refreshing TENTATIVE-Version2...');
      
      // Run the main update process
      loadTENTATIVEVersion2();
      
      // Log the successful update
      console.log('✅ AUTO-UPDATE: TENTATIVE-Version2 has been updated successfully');
      
      // Optional: Send notification email (if configured)
      // sendUpdateNotification(updateInfo);
      
    } else {
      console.log('ℹ️ AUTO-UPDATE: No updates needed, TENTATIVE sheet is current');
    }
    
  } catch (error) {
    console.error('❌ AUTO-UPDATE ERROR:', error.message);
    
    // Optional: Send error notification
    // sendErrorNotification(error);
  }
}

/**
 * Manual trigger to immediately check and update if needed
 */
function manualCheckAndUpdate() {
  console.log('👤 MANUAL UPDATE: Checking for form response updates...');
  
  const updateInfo = checkForFormResponseUpdates();
  
  if (updateInfo.needsUpdate) {
    console.log('🔄 MANUAL UPDATE: Updates detected, proceeding with refresh...');
    
    const startTime = new Date();
    loadTENTATIVEVersion2();
    const endTime = new Date();
    
    console.log(`✅ MANUAL UPDATE: Completed in ${(endTime - startTime) / 1000} seconds`);
    
    if (updateInfo.studentsAffected) {
      console.log(`📊 Updated data for ${updateInfo.studentsAffected.length} students`);
    }
    
  } else {
    console.log('ℹ️ MANUAL UPDATE: No updates needed');
    console.log('📝 Reason:', updateInfo.reason);
  }
}

/**
 * Quick setup function - sets up the recommended trigger configuration
 * This is the easiest way to enable automatic updates
 */
function setupRecommendedTriggers() {
  console.log('=== SETTING UP RECOMMENDED AUTO-UPDATE CONFIGURATION ===');
  
  try {
    // Set up spreadsheet edit trigger (immediate response to form changes)
    console.log('1. Setting up spreadsheet edit trigger...');
    setupSpreadsheetEditTrigger();
    
    // Set up time-based trigger as backup (every 6 hours)
    console.log('2. Setting up backup time-based trigger...');
    setupAutoUpdateTrigger(6);
    
    console.log('\n✅ SETUP COMPLETE!');
    console.log('📝 Your TENTATIVE-Version2 sheet will now update automatically when:');
    console.log('   • Form Responses 1 sheet is edited (immediate)');
    console.log('   • Every 6 hours as a backup check');
    console.log('\n📊 Run showTriggerStatus() to verify the setup');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  }
}

/**
 * Remove all auto-update triggers
 */
function removeAllTriggers() {
  console.log('=== REMOVING ALL AUTO-UPDATE TRIGGERS ===');
  
  try {
    removeAutoUpdateTrigger();
    removeSpreadsheetEditTrigger();
    
    // Also remove any form submit triggers
    const triggers = ScriptApp.getProjectTriggers();
    let removedFormTriggers = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onFormSubmit') {
        ScriptApp.deleteTrigger(trigger);
        removedFormTriggers++;
      }
    });
    
    if (removedFormTriggers > 0) {
      console.log(`✅ Removed ${removedFormTriggers} form submit trigger(s)`);
    }
    
    console.log('\n🔄 All auto-update triggers have been removed');
    console.log('💡 To re-enable automatic updates, run: setupRecommendedTriggers()');
    
  } catch (error) {
    console.error('❌ Error removing triggers:', error.message);
  }
}

/**
 * Shows the current trigger status
 */
function showTriggerStatus() {
  console.log('=== AUTO-UPDATE TRIGGER STATUS ===');
  
  try {
    const triggers = ScriptApp.getProjectTriggers();
    
    // Check for time-based auto-update triggers
    const autoUpdateTriggers = triggers.filter(trigger => 
      trigger.getHandlerFunction() === 'autoCheckAndUpdate'
    );
    
    // Check for spreadsheet edit triggers
    const editTriggers = triggers.filter(trigger => 
      trigger.getHandlerFunction() === 'onSpreadsheetEdit'
    );
    
    // Check for form submit triggers
    const formSubmitTriggers = triggers.filter(trigger => 
      trigger.getHandlerFunction() === 'onFormSubmit'
    );
    
    console.log('\n📊 TRIGGER SUMMARY:');
    console.log(`⏰ Time-based triggers: ${autoUpdateTriggers.length}`);
    console.log(`📝 Spreadsheet edit triggers: ${editTriggers.length}`);
    console.log(`📋 Form submit triggers: ${formSubmitTriggers.length}`);
    
    if (autoUpdateTriggers.length === 0 && editTriggers.length === 0 && formSubmitTriggers.length === 0) {
      console.log('\n❌ No auto-update triggers are currently active');
      console.log('💡 Recommended setup options:');
      console.log('   • setupAutoUpdateTrigger(6) - Check every 6 hours');
      console.log('   • setupSpreadsheetEditTrigger() - Update when sheet is edited');
    } else {
      // Show details for each type of trigger
      if (autoUpdateTriggers.length > 0) {
        console.log('\n⏰ TIME-BASED TRIGGERS:');
        autoUpdateTriggers.forEach((trigger, index) => {
          console.log(`   ${index + 1}. Function: ${trigger.getHandlerFunction()}`);
          console.log(`      Event Type: Scheduled time-based execution`);
        });
      }
      
      if (editTriggers.length > 0) {
        console.log('\n� SPREADSHEET EDIT TRIGGERS:');
        editTriggers.forEach((trigger, index) => {
          console.log(`   ${index + 1}. Function: ${trigger.getHandlerFunction()}`);
          console.log(`      Event Type: Triggers when Form Responses 1 is edited`);
        });
      }
      
      if (formSubmitTriggers.length > 0) {
        console.log('\n📋 FORM SUBMIT TRIGGERS:');
        formSubmitTriggers.forEach((trigger, index) => {
          console.log(`   ${index + 1}. Function: ${trigger.getHandlerFunction()}`);
          console.log(`      Event Type: Triggers when form is submitted`);
        });
      }
    }
    
    console.log('\n=== AVAILABLE COMMANDS ===');
    console.log('⏰ setupAutoUpdateTrigger(hours) - Set up time-based checking');
    console.log('📝 setupSpreadsheetEditTrigger() - Trigger on sheet edits (RECOMMENDED)');
    console.log('📋 setupFormSubmitTrigger() - Trigger on form submits (if form is linked)');
    console.log('🗑️ removeAutoUpdateTrigger() - Remove time-based triggers');
    console.log('🗑️ removeSpreadsheetEditTrigger() - Remove edit triggers');
    console.log('▶️ manualCheckAndUpdate() - Run update check now');
    console.log('📊 showUpdateRecommendations() - Check if updates are needed');
    
  } catch (error) {
    console.error('❌ Error checking trigger status:', error.message);
  }
}

/**
 * Set up a spreadsheet edit trigger (alternative approach)
 * This triggers when the spreadsheet is edited, including when form responses are added
 */
function setupSpreadsheetEditTrigger() {
  console.log('Setting up spreadsheet edit trigger...');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Delete existing edit triggers to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onSpreadsheetEdit' && 
          trigger.getEventType() === ScriptApp.EventType.ON_CHANGE) {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new spreadsheet change trigger (onChange is the correct method)
    ScriptApp.newTrigger('onSpreadsheetEdit')
      .forSpreadsheet(spreadsheet)
      .onChange()
      .create();
    
    console.log('✅ Spreadsheet edit trigger created successfully');
    console.log('📝 Will automatically check for updates when the spreadsheet is edited');
    
  } catch (error) {
    console.error('❌ Error setting up spreadsheet edit trigger:', error.message);
  }
}

/**
 * Handler for spreadsheet change events
 * @param {Object} e - Change event object
 */
function onSpreadsheetEdit(e) {
  try {
    // For onChange events, we need to check the active spreadsheet directly
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = spreadsheet.getActiveSheet();
    const sheetName = activeSheet ? activeSheet.getName() : null;
    
    // If we can't get the sheet name, check all relevant sheets
    const formResponsesSheet = spreadsheet.getSheetByName(SHEET_NAMES.FORM_RESPONSES_1);
    
    if (sheetName === SHEET_NAMES.FORM_RESPONSES_1 || !sheetName) {
      console.log('📝 CHANGE DETECTED: Spreadsheet was modified, checking if update needed...');
      
      // Small delay to ensure data is fully processed
      Utilities.sleep(1000);
      
      // Check if update is actually needed
      const updateInfo = checkForFormResponseUpdates();
      
      if (updateInfo.needsUpdate) {
        console.log('🔄 UPDATE TRIGGERED: Running TENTATIVE sheet update...');
        loadTENTATIVEVersion2();
        console.log('✅ AUTO-UPDATE: TENTATIVE sheet updated successfully');
      } else {
        console.log('ℹ️ No update needed after change');
      }
    }
    
  } catch (error) {
    console.error('❌ CHANGE TRIGGER ERROR:', error.message);
  }
}

/**
 * Remove the spreadsheet edit trigger
 */
function removeSpreadsheetEditTrigger() {
  console.log('Removing spreadsheet edit trigger...');
  
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let removedCount = 0;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onSpreadsheetEdit') {
        ScriptApp.deleteTrigger(trigger);
        removedCount++;
      }
    });
    
    console.log(`✅ Removed ${removedCount} spreadsheet edit trigger(s)`);
    
  } catch (error) {
    console.error('❌ Error removing trigger:', error.message);
  }
}

/**
 * Set up a form submit trigger (alternative approach)
 * This only works if the form is directly connected to this spreadsheet
 * Note: This method may not work in all configurations
 */
function setupFormSubmitTrigger() {
  console.log('Setting up form submit trigger...');
  
  try {
    // First, try to get the form associated with this spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const form = FormApp.openByUrl(spreadsheet.getFormUrl());
    
    if (!form) {
      console.log('❌ No form directly linked to this spreadsheet');
      console.log('💡 Consider using setupSpreadsheetEditTrigger() instead');
      return;
    }
    
    // Delete existing form submit triggers to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onFormSubmit' && 
          trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT) {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Create new form submit trigger using the form
    ScriptApp.newTrigger('onFormSubmit')
      .onFormSubmit()
      .create();
    
    console.log('✅ Form submit trigger created successfully');
    console.log('📝 Will automatically update TENTATIVE sheet when new forms are submitted');
    
  } catch (error) {
    console.error('❌ Error setting up form submit trigger:', error.message);
    console.log('ℹ️ This method requires the Google Form to be directly linked to this spreadsheet');
    console.log('💡 Alternative: Use setupSpreadsheetEditTrigger() or setupAutoUpdateTrigger()');
  }
}

/**
 * Handler for form submit events
 * @param {Object} e - Form submit event object
 */
function onFormSubmit(e) {
  console.log('📝 FORM SUBMIT: New form response detected, updating TENTATIVE sheet...');
  
  try {
    // Small delay to ensure form data is fully processed
    Utilities.sleep(2000);
    
    // Run the update
    loadTENTATIVEVersion2();
    
    console.log('✅ FORM SUBMIT: TENTATIVE sheet updated successfully');
    
  } catch (error) {
    console.error('❌ FORM SUBMIT ERROR:', error.message);
  }
}
