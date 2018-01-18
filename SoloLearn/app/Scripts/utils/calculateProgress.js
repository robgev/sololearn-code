export default (levels, userLevel, currentXp) => {
	const milestones = levels.filter(item => item.status != null);
	const highestMilestone = milestones[milestones.length - 1];

	// TODO Rewrite
	if (userLevel >= highestMilestone.number) {
		const maxXp = currentXp;
		const { status } = highestMilestone;
		return { maxXp, status };
	}

	const remainingLevels = levels.slice(userLevel);
	const closestLevelWithStatusIndex =
		remainingLevels.findIndex(currentLevel => currentLevel.status !== null);
	const { maxXp = null } = levels[closestLevelWithStatusIndex - 1] || {};
	const { status = '' } = closestLevelWithStatusIndex[closestLevelWithStatusIndex] || {};
	return { maxXp, status };
};
