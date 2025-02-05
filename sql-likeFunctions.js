/**
 * Retrive all rows and columns from a map.
 * This is equivalent to
 *      1  select *
 *      2    from map
 * https://www.w3schools.com/sql/sql_join.asp
 * 
 * @returns {Array} - An array of all values from the map
 */
function selectAllFromMap(map) {
  let result = [];

  map.forEach((value, key) => {
    result.push(value);
  });
  return result;
}

/**
 * Performs a SQL-like (INNER) JOIN on two maps (https://www.w3schools.com/sql/sql_join.asp).
 * 
 * @param {Map<number, Object>} mapA - This is the left "table", where the key is the student ID and the value is an object representing the row.
 * @param {Map<number, Object>} mapB - This is the right "table", where the key is the student ID and the value is an object representing the row.
 * @returns {Array<Object>} - An array of objects that have matching student IDs in both maps.
 * 
 * @example
 * const mapA = new Map([
 *   [1, { name: 'Alice', age: 20 }],
 *   [2, { name: 'Bob', age: 22 }]
 * ]);
 * const mapB = new Map([
 *   [1, { grade: 'A' }],
 *   [3, { grade: 'B' }]
 * ]);
 * 
 * const result = innerJoinMaps(mapA, mapB);
 * console.log(result); // [{ name: 'Alice', age: 20, grade: 'A' }]
 */
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

/**
 * Performs a SQL-like LEFT (OUTER) JOIN on two or more maps (https://www.w3schools.com/sql/sql_join.asp).
 * 
 * @param {Map<number, Array<Object>>} mapA - This is the left "table", where the key is the student ID and the value is an array representing the row.
 * @param {...Map<number, Array<Object>>} maps - These are the right "tables", where the key is the student ID and the value is an array representing the row.
 * @returns {Map<number, Array<Array<Object|null>>>} - A map where each key is a student ID and the value is an array of arrays. Each inner array contains all records from the left map, and the matched records from the right maps. If no match is found in the right maps, null is used as a placeholder.
 * 
 * @example
 * const mapA = new Map([
 *   [123456, [{ name: 'Alice', age: 20 }]],
 *   [234567, [{ name: 'Bob', age: 22 }]]
 * ]);
 * const mapB = new Map([
 *   [123456, [{ grade: 'A' }]],
 *   [345678, [{ grade: 'B' }]]
 * ]);
 * 
 * const result = leftJoinMaps(mapA, mapB);
 * console.log(result); // Map { 123456 => [[{ name: 'Alice', age: 20 }], [{ grade: 'A' }]], 234567 => [[{ name: 'Bob', age: 22 }], [null]] }
 */
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

/**
 * Performs a SQL-like RIGHT (OUTER) JOIN on two or more maps (https://www.w3schools.com/sql/sql_join_right.asp).
 * 
 * @param {Map<number, Array<Object>>} mapA - This is the left "table", where the key is the student ID and the value is an array representing the row.
 * @param {...Map<number, Array<Object>>} maps - These are the right "tables", where the key is the student ID and the value is an array representing the row.
 * @returns {Map<number, Array<Array<Object|null>>>} - A map where each key is a student ID and the value is an array of arrays. Each inner array contains all records from the right maps, and the matched records from the left map. If no match is found in the left map, null is used as a placeholder.
 * 
 * @example
 * const mapA = new Map([
 *   [123456, [{ name: 'Alice', age: 20 }]],
 *   [234567, [{ name: 'Bob', age: 22 }]]
 * ]);
 * const mapB = new Map([
 *   [123456, [{ grade: 'A' }]],
 *   [345678, [{ grade: 'B' }]]
 * ]);
 * 
 * const result = rightJoinMaps(mapA, mapB);
 * console.log(result); // Map { 123456 => [[{ name: 'Alice', age: 20 }], [{ grade: 'A' }]], 345678 => [[null], [{ grade: 'B' }]] }
 */
function rightJoinMaps(mapA, ...maps) {
    let result = new Map();

    // Iterate over all provided maps
    maps.forEach((mapB) => {
        mapB.forEach((valuesB, studentID_B) => {
            // Initialize the combined data with values from Map B
            let combinedData = [valuesB];  // Wrap valuesB in an array

            // Check if Map A has an entry with the same studentID
            let valuesA = mapA.get(studentID_B); // Use the numeric student ID directly

            if (valuesA) {
                // If a match is found in Map A, prepend the array to combinedData
                combinedData.unshift(valuesA);  // Prepend the values from Map A to the combined array
            } else {
                // If no match is found, prepend null or placeholder for the current map's missing values
                combinedData.unshift([null]);
            }

            // Add the combined data to the result Map, using the studentID as the key
            result.set(studentID_B, combinedData); // Store the ID as a number
        });
    });

    return result;
}

/**
 * Performs a SQL-like FULL (OUTER) JOIN on two maps (https://www.w3schools.com/sql/sql_join_full.asp).
 * 
 * @param {Map<number, Array<Object>>} mapA - This is the left "table", where the key is the student ID and the value is an array representing the row.
 * @param {Map<number, Array<Object>>} mapB - This is the right "table", where the key is the student ID and the value is an array representing the row.
 * @returns {Map<number, Array<Array<Object|null>>>} - A map where each key is a student ID and the value is an array of arrays. Each inner array contains all records from both maps. If no match is found in one of the maps, null is used as a placeholder.
 * 
 * @example
 * const mapA = new Map([
 *   [123456, [{ name: 'Alice', age: 20 }]],
 *   [234567, [{ name: 'Bob', age: 22 }]]
 * ]);
 * const mapB = new Map([
 *   [123456, [{ grade: 'A' }]],
 *   [345678, [{ grade: 'B' }]]
 * ]);
 * 
 * const result = fullJoinMaps(mapA, mapB);
 * console.log(result); // Map { 123456 => [[{ name: 'Alice', age: 20 }], [{ grade: 'A' }]], 234567 => [[{ name: 'Bob', age: 22 }], [null]], 345678 => [[null], [{ grade: 'B' }]] }
 */
function fullJoinMaps(mapA, mapB) {
    let result = new Map();

    // Add all entries from mapA to the result
    mapA.forEach((valuesA, studentID_A) => {
        let combinedData = [valuesA];

        // Check if mapB has an entry with the same studentID
        let valuesB = mapB.get(studentID_A);

        if (valuesB) {
            combinedData.push(valuesB);
        } else {
            combinedData.push([null]);
        }

        result.set(studentID_A, combinedData);
    });

    // Add entries from mapB that are not in mapA to the result
    mapB.forEach((valuesB, studentID_B) => {
        if (!result.has(studentID_B)) {
            let combinedData = [[null], valuesB];
            result.set(studentID_B, combinedData);
        }
    });

    return result;
}

/**
 * Filters out entries from mapA that have matching keys in mapB.
 * 
 * @param {Map<number, Array<Object>>} mapA - The source map, where the key is the student ID and the value is an array representing the row.
 * @param {Map<number, Array<Object>>} mapB - The map containing keys to filter out from mapA, where the key is the student ID and the value is an array representing the row.
 * @returns {Map<number, Array<Object>>} - A new map containing entries from mapA that do not have matching keys in mapB.
 * 
 * @example
 * const mapA = new Map([
 *   [123456, [{ name: 'Alice', age: 20 }]],
 *   [234567, [{ name: 'Bob', age: 22 }]]
 * ]);
 * const mapB = new Map([
 *   [123456, [{ grade: 'A' }]],
 *   [345678, [{ grade: 'B' }]]
 * ]);
 * 
 * const result = filterOutMatchesFromMapA(mapA, mapB);
 * console.log(result); // Map { 234567 => [{ name: 'Bob', age: 22 }] }
 */
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

function enhancedFilterOutMatches(entryWithdrawalMap, withdrawnMap) {
  // const returned is a filtered result of students based on their withdrawn status and re-enrollment conditions; in other words "returned" has students who are currently active that are repeating a placement. These students will get added to the result below.
  const returned = Array.from(entryWithdrawalMap.entries()).filter(
    ([studentID, entries]) =>
      entries.length > 1 && entries[0]["Withdraw Date"] === ""
  );

  let result = new Map();

  entryWithdrawalMap.forEach((entryData, studentID) => {
    // Check if the student is present in the withdrawnMap
    if (!withdrawnMap.has(studentID)) {
      // If not withdrawn, add the entry to the result map
      result.set(studentID, entryData);
    } else {
      // If withdrawn, check if the student is in the "returned" list
      const isReturned = returned.some(([id]) => id === studentID);

      if (isReturned) {
        // If returned, include the student in the result
        result.set(studentID, entryData);
      }
    }
  });

  return result;
}
