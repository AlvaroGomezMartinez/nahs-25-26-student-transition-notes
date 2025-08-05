/**
 * @fileoverview Update Detection Utility for NAHS system.
 * 
 * This utility helps detect when Form Responses 1 has been updated
 * and suggests when the TENTATIVE-Version2 sheet needs to be refreshed.
 * 
 * @author Alvaro Gomez
 * @version 1.0.0
 * @since 2025-08-05
 */

/**
 * Checks for new or updated form responses since the last processing run
 * Focus on detecting multiple submissions from same teacher for same student
 * @returns {Object} Summary of updates needed
 */
function checkForFormResponseUpdates() {
  console.log('=== CHECKING FOR FORM RESPONSE UPDATES ===');
  
  try {
    // Get the Form Responses 1 sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.FORM_RESPONSES_1);
    
    if (!sheet) {
      console.log('❌ Form Responses 1 sheet not found');
      return { needsUpdate: false, reason: 'Sheet not found' };
    }
    
    // Get all data
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log('ℹ️ No form responses found');
      return { needsUpdate: false, reason: 'No responses' };
    }
    
    const headers = data[0];
    const timestampIndex = headers.findIndex(header => 
      header.toLowerCase().includes('timestamp') || 
      header.toLowerCase().includes('date') ||
      header.toLowerCase().includes('submit')
    );
    
    const studentIndex = 5; // Fixed to column F where student IDs are located after column cleanup
    const emailIndex = headers.findIndex(header => header.toLowerCase().includes('email'));
    
    if (timestampIndex === -1) {
      console.log('⚠️ No timestamp column found in form responses');
      return { needsUpdate: true, reason: 'Cannot determine update status - recommend running update' };
    }
    
    if (emailIndex === -1) {
      console.log('⚠️ Required Email column not found - proceeding with basic timestamp check');
    }
    
    // Find the most recent form response timestamp
    let mostRecentFormResponse = null;
    for (let i = 1; i < data.length; i++) {
      const timestamp = data[i][timestampIndex];
      if (timestamp) {
        const date = new Date(timestamp);
        if (!mostRecentFormResponse || date > mostRecentFormResponse) {
          mostRecentFormResponse = date;
        }
      }
    }
    
    console.log('📅 Most recent form response:', mostRecentFormResponse?.toLocaleString() || 'None');
    
    // Check for duplicate submissions from same teacher for same student
    const duplicateInfo = findDuplicateSubmissions(data, headers);
    
    // Get TENTATIVE-Version2 sheet to check last update
    const tentativeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TENTATIVE_V2);
    
    if (!tentativeSheet) {
      console.log('❌ TENTATIVE-Version2 sheet not found');
      // This is actually okay - we can still check form responses for updates
      return { 
        needsUpdate: true, 
        reason: 'TENTATIVE sheet missing - update recommended',
        mostRecentFormResponse: mostRecentFormResponse,
        duplicateSubmissions: duplicateInfo.duplicates,
        studentsWithDuplicates: duplicateInfo.studentsWithDuplicates
      };
    }
    
    // Check when TENTATIVE sheet was last modified
    const tentativeLastModified = tentativeSheet.getLastEditedDate ? tentativeSheet.getLastEditedDate() : new Date(0);
    
    console.log('📅 TENTATIVE sheet last modified:', tentativeLastModified.toLocaleString());
    
    const needsUpdate = mostRecentFormResponse && mostRecentFormResponse > tentativeLastModified;
    const hasDuplicates = duplicateInfo.duplicates.length > 0;
    
    if (needsUpdate || hasDuplicates) {
      const reasons = [];
      if (needsUpdate) reasons.push('New form responses detected');
      if (hasDuplicates) reasons.push(`${duplicateInfo.duplicates.length} teacher(s) have multiple submissions`);
      
      console.log('🔄 UPDATE NEEDED:', reasons.join(' + '));
      
      if (hasDuplicates) {
        console.log('📋 Teachers with multiple submissions:');
        duplicateInfo.duplicates.forEach(dup => {
          console.log(`   • ${dup.teacherName}: ${dup.count} submissions for Student ${dup.studentId}`);
        });
      }
      
      return {
        needsUpdate: true,
        reason: reasons.join(' + '),
        mostRecentFormResponse: mostRecentFormResponse,
        tentativeLastModified: tentativeLastModified,
        duplicateSubmissions: duplicateInfo.duplicates,
        studentsWithDuplicates: duplicateInfo.studentsWithDuplicates
      };
    } else {
      console.log('✅ No update needed: TENTATIVE sheet is current and no duplicate submissions found');
      return {
        needsUpdate: false,
        reason: 'TENTATIVE sheet is up to date and no duplicate submissions',
        mostRecentFormResponse: mostRecentFormResponse,
        tentativeLastModified: tentativeLastModified,
        duplicateSubmissions: [],
        studentsWithDuplicates: []
      };
    }
    
  } catch (error) {
    console.error('❌ Error checking for updates:', error.message);
    return { 
      needsUpdate: true, 
      reason: `Error occurred: ${error.message} - recommend running update to be safe` 
    };
  }
}

/**
 * Finds duplicate submissions from same teacher for same student
 * @param {Array} data - Form responses data
 * @param {Array} headers - Column headers
 * @returns {Object} Information about duplicate submissions
 */
function findDuplicateSubmissions(data, headers) {
  const studentIndex = 5; // Fixed to column F where student IDs are located after column cleanup
  const emailIndex = headers.findIndex(header => header.toLowerCase().includes('email'));
  const timestampIndex = headers.findIndex(header => 
    header.toLowerCase().includes('timestamp') || 
    header.toLowerCase().includes('date')
  );
  
  if (emailIndex === -1) {
    console.log('⚠️ Email column not found, cannot detect duplicates');
    return { duplicates: [], studentsWithDuplicates: [] };
  }
  
  // Group responses by student + teacher combination
  const responseGroups = new Map();
  
  for (let i = 1; i < data.length; i++) {
    const studentText = data[i][studentIndex];
    const email = data[i][emailIndex];
    const timestamp = timestampIndex !== -1 ? data[i][timestampIndex] : null;
    
    const studentId = extractStudentId(studentText);
    if (!studentId || !email) continue;
    
    const key = `${studentId}-${email}`;
    
    if (!responseGroups.has(key)) {
      responseGroups.set(key, []);
    }
    
    responseGroups.get(key).push({
      row: i + 1,
      studentId,
      email,
      timestamp: timestamp ? new Date(timestamp) : null,
      teacherName: email // We'll use email as teacher name for now
    });
  }
  
  // Find groups with multiple responses
  const duplicates = [];
  const studentsWithDuplicates = new Set();
  
  responseGroups.forEach((responses, key) => {
    if (responses.length > 1) {
      const studentId = responses[0].studentId;
      const teacherName = responses[0].teacherName;
      
      duplicates.push({
        studentId,
        teacherName,
        email: responses[0].email,
        count: responses.length,
        submissions: responses.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return a.timestamp - b.timestamp;
        })
      });
      
      studentsWithDuplicates.add(studentId);
    }
  });
  
  return {
    duplicates,
    studentsWithDuplicates: Array.from(studentsWithDuplicates)
  };
}

/**
 * Finds students who have form responses newer than the given date
 * @param {Array} data - Form responses data
 * @param {Array} headers - Column headers
 * @param {Date} sinceDate - Date to compare against
 * @returns {Array} Array of student IDs with recent updates
 */
function findStudentsWithRecentUpdates(data, headers, sinceDate) {
  const timestampIndex = headers.findIndex(header => 
    header.toLowerCase().includes('timestamp') || 
    header.toLowerCase().includes('date') ||
    header.toLowerCase().includes('submit')
  );
  
  const studentIndex = 5; // Fixed to column F where student IDs are located after column cleanup
  
  if (timestampIndex === -1) {
    console.log('⚠️ Timestamp column not found');
    return [];
  }
  
  const studentsWithUpdates = new Set();
  
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][timestampIndex]);
    const studentText = data[i][studentIndex];
    
    if (timestamp > sinceDate && studentText) {
      const studentId = extractStudentId(studentText);
      if (studentId) {
        studentsWithUpdates.add(studentId);
      }
    }
  }
  
  console.log(`📋 Found ${studentsWithUpdates.size} students with recent form updates:`, Array.from(studentsWithUpdates));
  
  return Array.from(studentsWithUpdates);
}

/**
 * Displays a summary of update recommendations
 */
function showUpdateRecommendations() {
  const updateInfo = checkForFormResponseUpdates();
  
  console.log('\n=== UPDATE RECOMMENDATIONS ===');
  
  if (updateInfo.needsUpdate) {
    console.log('🔄 RECOMMENDATION: Run the main script to update TENTATIVE-Version2');
    console.log('📝 Reason:', updateInfo.reason);
    
    if (updateInfo.studentsAffected && updateInfo.studentsAffected.length > 0) {
      console.log('👥 Students with new responses:', updateInfo.studentsAffected.join(', '));
    }
    
    console.log('\n📋 To update, run: loadTENTATIVEVersion2()');
  } else {
    console.log('✅ RECOMMENDATION: No update needed at this time');
    console.log('📝 Reason:', updateInfo.reason);
  }
}
