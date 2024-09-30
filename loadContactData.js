function loadContactData() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ContactInfo");
    let data = sheet.getDataRange().getValues();
    let headers = data[0];

    let contactMap7 = new Map();

    for (let i = 1; i < data.length; i++) {
        let studentId = data[i][headers.indexOf("Student ID")];

        let studentData = {};
        for (let j = 0; j < headers.length; j++) {
            studentData[headers[j]] = data[i][j];
        }

        if (contactMap7.has(studentId)) {
            contactMap7.get(studentId).push(studentData);
        } else {
            contactMap7.set(studentId, [studentData]);
        }
    }
    return contactMap7;
}