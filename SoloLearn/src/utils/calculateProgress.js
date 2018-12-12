export default (levels, userLevel, currentXp) => {
	const milestones = levels.filter(item => item.status != null);
	const highestMilestone = milestones[milestones.length - 1];
	
	const prevLevel = levels.slice().reverse().find(l => l.number <= userLevel && l.status !== null);
	const { status:currentStatus } = prevLevel || {};

	if (userLevel >= highestMilestone.number) {
		const maxXp = currentXp;
		const { status } = highestMilestone;
		return { maxXp, status, currentStatus, levelsToNext: 0 };
	}

	const nextLevelIndex = levels.findIndex(l => l.number >= userLevel && l.status !== null);
	const { maxXp = null } = levels[nextLevelIndex - 1] || {};
	const { status, number } = levels[nextLevelIndex] || {};
	
	return { maxXp, status, currentStatus, levelsToNext: number - userLevel };
};
