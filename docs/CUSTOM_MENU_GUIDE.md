# Custom Menu Setup Guide

## 🚩 Custom "Run Scripts" Menu Implementation

This document explains the new custom dropdown menu functionality that allows users to easily run the TENTATIVE-Version2 update directly from the Google Sheets interface.

## ✨ Features

### 📋 **Custom Menu: "🚩Run Scripts"**
- **Location**: Appears in the Google Sheets menu bar next to "Help"
- **Auto-Creation**: Automatically created when the spreadsheet is opened
- **User-Friendly**: Easy access to system functions without needing to know function names

### 🎯 **Menu Options**
1. **Update TENTATIVE-Version2** - Main update function with timestamp
2. **Manual Check and Update** - Checks if update is needed before running
3. **Show Trigger Status** - Displays current auto-update trigger status
4. **Setup Auto-Update Triggers** - Configures automatic updating
5. **Remove All Triggers** - Removes all automatic triggers

### 📝 **Automatic Timestamp in A1**
- **Format**: "Rows and comments updated on 08/09/25 2:03 PM"
- **Location**: Cell A1 in TENTATIVE-Version2 sheet
- **Updated**: Every time the menu update function is run
- **Purpose**: Shows users when the data was last refreshed

## 🚀 Setup Instructions

### **Step 1: Deploy the Code**
1. Copy the contents of `src/utils/customMenu.js` to your Google Apps Script project
2. Make sure the `loadTENTATIVEVersion2()` function is available in your script

### **Step 2: Initial Menu Creation**
Run this function in the Apps Script editor:
```javascript
createCustomMenu();
```

### **Step 3: Enable Auto-Creation (Recommended)**
The menu will automatically appear when users open the spreadsheet because the `onOpen()` function is included.

## 📊 Usage Instructions

### **For End Users:**
1. **Open the Google Spreadsheet**
2. **Look for "🚩Run Scripts" in the menu bar** (next to "Help")
3. **Click the menu** to see available options
4. **Select "Update TENTATIVE-Version2"** to run the update
5. **Check cell A1** to see when the update completed

### **For Administrators:**
```javascript
// Test the menu functionality
testCustomMenuFunctions();

// Manually create menu if it doesn't appear
createCustomMenu();

// Test just the timestamp update
updateTimestampOnly();

// Test date formatting
testDateFormatting();
```

## 🔧 Technical Details

### **Function Flow:**
1. User clicks "Update TENTATIVE-Version2" from menu
2. `menuUpdateTentativeVersion2()` is called
3. Function calls `loadTENTATIVEVersion2()` (your main process)
4. Function calls `updateTimestampInA1()` to update cell A1
5. Success/error message shown to user

### **Date Format Implementation:**
```javascript
// Input: Date object
// Output: "08/09/25 2:03 PM"
function formatDateTimeForA1(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}
```

### **Error Handling:**
- Shows user-friendly error messages
- Logs detailed errors to console
- Graceful handling of missing sheets
- Fallback date formatting if needed

## 🎯 User Benefits

### **Simplified Access:**
- ✅ No need to know function names
- ✅ No need to open Apps Script editor
- ✅ Clear visual feedback on completion
- ✅ Timestamp shows when data was last updated

### **Professional Interface:**
- ✅ Clean menu integration
- ✅ Success/error dialogs
- ✅ Consistent with Google Sheets UI
- ✅ Emoji indicators for easy identification

## 🔍 Troubleshooting

### **Menu Doesn't Appear:**
```javascript
// Run this function manually
createCustomMenu();
```

### **Permission Issues:**
- Make sure the script has permission to modify the spreadsheet
- Check that the user has edit access to the sheet

### **A1 Update Fails:**
- Verify the "TENTATIVE-Version2" sheet exists
- Check sheet name spelling is exact
- Ensure cell A1 is not protected

### **Testing:**
```javascript
// Run comprehensive test
testCustomMenuFunctions();

// Test specific components
testDateFormatting();
updateTimestampOnly();
```

## 📋 File Structure

```
src/utils/
├── customMenu.js          # Main menu implementation
└── autoUpdate.js         # Auto-update functionality (existing)

test_customMenu.js        # Test functions (git-ignored)
```

## 🎉 Complete Implementation

Your Google Sheets users now have:
- 🚩 **Easy-to-find menu** in the spreadsheet interface
- ⚡ **One-click updates** with "Update TENTATIVE-Version2"
- 📅 **Clear timestamps** showing when data was last refreshed
- 💬 **User-friendly messages** for success and errors
- 🔧 **Advanced options** for power users

The system is now production-ready with a professional user interface! 🚀
