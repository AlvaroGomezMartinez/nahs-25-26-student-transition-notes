/**
 * Holiday dates for NISD normalized to 'yyyy-MM-dd' format.
 *
 * The external library (`NISDHolidayLibrary.getHolidayDates()`) returns dates as
 * 'MM/DD/YYYY'. The rest of the codebase compares against 'yyyy-MM-dd' strings,
 * so we normalize here. If the external library is unavailable during tests,
 * we safely fall back to an empty array.
 *
 * @constant {string[]} holidayDates - Array of ISO-style date strings 'yyyy-MM-dd'
 */
let holidayDates = [];

try {
	const raw = (typeof NISDHolidayLibrary !== 'undefined' &&
							 NISDHolidayLibrary.getHolidayDates) ?
							 NISDHolidayLibrary.getHolidayDates() : [];

	if (Array.isArray(raw)) {
		// Convert 'MM/DD/YYYY' -> 'yyyy-MM-dd'
		holidayDates = raw.map(s => {
			try {
				// Some entries may already be ISO; try parsing flexibly
				const parts = String(s).trim();
				const d = new Date(parts);
				if (isNaN(d.getTime())) {
					// Try manual parse for MM/DD/YYYY
					const m = parts.split('/');
					if (m.length === 3) {
						const mm = String(m[0]).padStart(2, '0');
						const dd = String(m[1]).padStart(2, '0');
						const yyyy = m[2];
						return `${yyyy}-${mm}-${dd}`;
					}
					return null;
				}
				const yyyy = d.getFullYear();
				const mm = String(d.getMonth() + 1).padStart(2, '0');
				const dd = String(d.getDate()).padStart(2, '0');
				return `${yyyy}-${mm}-${dd}`;
			} catch (e) {
				return null;
			}
		}).filter(Boolean);
	}

} catch (error) {
	// If the external library isn't available (tests, local runs), keep empty list
	console.warn('holidayDates: Could not load NISDHolidayLibrary, continuing with no holidays');
	holidayDates = [];
}

// holidayDates is available in the global scope for other modules to use
