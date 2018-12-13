const findBestRank = (ranks = {}) =>
	// We need to find one best rank
	// And we also need the key for localization
	Object.keys(ranks).reduce((best, key) => {
		// We start with handling some common cases
		// To reduce the number of operations
		// We don't need null ranks (obviously)
		// And also the ranks that are bigger than
		// 10% in percintile rank
		// and numeric ranks which are bigger than 50
		// (Being top 53 or 15% cannot be counted as
		// an achievement in any field)
		if (
			ranks[key] !== null &&
				((key.includes('Rank') && ranks[key] < 10) ||
				(key.includes('Percent') && ranks[key] < 50))
		) {
			// Now we check some cases
			// Numerical ranks have priority over
			// Percintile ranks
			// If we have percintile rank as best rank
			// And there is any numerical rank that passed
			// The initial test, we take that numerical rank
			// (this part is provided by hasPriority flag)
			// In case of normal priority we check the rank
			// normally and take the new value if it is smaller
			// P.S. Here is truth table of normalPriority flag
			// Best is Rank, Current is Rank -> true, take the smaller of 2
			// Best is Rank, Current is Percent -> false, keep current best
			// Best is Percent, Current is Rank -> handled by hasPriority
			// Best is Percent, Current is Percent -> true, take smaller of 2
			const isBestRank = best.key === 'Rank';
			const isCurrentRank = key.includes('Rank');
			const hasPriority = isCurrentRank && !isBestRank;
			const normalPriority = !isBestRank || isCurrentRank;
			if (
				best.key === null ||
						hasPriority ||
						(normalPriority && ranks[key] < best.rank)
			) {
				const isMonthly = key.includes('monthly');
				const isTotal = key.includes('Total');
				const monthOrWeek = isMonthly ? 'm' : 'w';
				const totalOrCountry = isTotal ? 't' : 'c';
				const percentOrRank = isCurrentRank ? 'r' : 'p';
				const formattedKey = `${monthOrWeek}${totalOrCountry}${percentOrRank}`;
				const queryParams = {
					mode:	isTotal ? 0 : 2,
					range: isMonthly ? 30 : 7,
				};
				return {
					key: formattedKey,
					rank: ranks[key],
					queryParams,
				};
			}
		}
		// If the check of above cases is not passed
		// We just return the rank we already have
		// This is done for having consistent return
		return best;
	}, { key: null, rank: null, queryParams: null });

export default findBestRank;
