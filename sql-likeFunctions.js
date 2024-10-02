/**
 * Retrive all rows and columns from a map.
 * This is equivalent to
 *      1  select *
 *      2    from map
 */
function selectAllFromMap(map) {
  let result = [];

  map.forEach((value, key) => {
    result.push(value);
  });
  return result;
}

// https://www.w3schools.com/sql/sql_join.asp

// (INNER) JOIN: Returns records that have matching values in both maps
function innerJoinMaps(mapA, mapB) {
    let result = [];

    // Iterate over Map A (left table)
    mapA.forEach((leftValue, studentID) => {
        // Check if the same studentID exists in Map B
        if (mapB.has(studentID)) {
            // Get the corresponding row from Map B
            let rightValue = mapB.get(studentID);

            // Combine the two rows (left and right table rows)
            let joinedRow = { ...leftValue, ...rightValue };

            // Add the joined row to the result set
            result.push(joinedRow);
        }
    });

    return result;
}

// LEFT (OUTER) JOIN: Returns all records from the left map, and the matched records from the right map
function leftJoinMaps(mapA, ...maps) {
    let result = new Map();

    // Iterate over Map A
    mapA.forEach((valuesA, studentID_A) => {
        // Initialize the combined data with values from Map A
        let combinedData = [...valuesA];  // Spread the array from Map A into combinedData

        // Iterate over all provided maps
        maps.forEach((mapB) => {
            // Check if the current map has an entry with the same studentID
            let valuesB = mapB.get(studentID_A); // Use the numeric student ID directly

            if (valuesB) {
                // If a match is found in the current map, append the array to combinedData
                combinedData.push(...valuesB);  // Append the values from Map B to the combined array
            } else {
                // If no match is found, append null or placeholder for the current map's missing values
                combinedData.push(null);
            }
        });

        // Add the combined data to the result Map, using the studentID as the key
        result.set(studentID_A, combinedData); // Store the ID as a number
    });

    return result;
}

// Filter out values from mapB from mapA
function filterOutMatchesFromMapA(mapA, mapB) {
    let result = new Map();

    // Iterate over Map A
    mapA.forEach((valuesA, studentID_A) => {
        // Check if Map B has an entry with the same studentID
        if (!mapB.has(studentID_A)) {
            // If no match is found in Map B, add the entry from Map A to the result
            result.set(studentID_A, valuesA);
        }
    });

    return result;
}





// RIGHT (OUTER) JOIN: Returns all records from the right map, and the matched records from the left map

// FULL (OUTER) JOIN: Returns all records when there is a match in either left or right map

