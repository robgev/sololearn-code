import React, { useRef } from 'react';
import { translate } from 'react-i18next';
import { FlexBox } from 'components/atoms';
import { ProgressBar } from 'components/molecules';

const getProgressFromProfile = (profile, levels) => {
	const { level: userLevel, xp: currentXp, badge } = profile;
	console.clear();
	console.warn(profile, levels);
	const nextMilestoneLevelIndex =
		levels.slice(userLevel).findIndex(lvl => lvl.status !== null);
	const [ currentBadge ] = badge ? badge.split('|') : '';
	if (nextMilestoneLevelIndex !== -1) {
		// Restore index after slice
		const { maxXp } = levels[userLevel + nextMilestoneLevelIndex];
		const nextMilestone = levels[userLevel + nextMilestoneLevelIndex].status;
		return {
			maxXp, nextMilestone, currentBadge, currentXp,
		};
	}
	const maxXp = currentXp;
	const [ nextMilestone ] = badge ? badge.split('|') : '';
	return {
		maxXp, nextMilestone, currentBadge, currentXp,
	};
};

const LevelProgress = ({ profile, levels, t }) => {
	const progressRef = useRef(null);

	const getProgress = () => {
		if (progressRef.current === null) {
			progressRef.current = getProgressFromProfile(profile, levels);
		}
		return progressRef.current;
	};

	const {
		maxXp, nextMilestone, currentBadge, currentXp,
	} = getProgress();

	console.warn(maxXp, nextMilestone, currentBadge, currentXp);

	return (
		<FlexBox fullWidth className="progress-section">
			<ProgressBar
				className="progress-bar"
				progressProps={{
					color: 'primary',
				}}
				value={(100 * currentXp) / maxXp}
				minText={currentBadge ? t(`profile.status-${currentBadge}`) : ''}
				maxText={t(`profile.status-${nextMilestone}`)}
			/>
		</FlexBox>
	);
};

export default translate()(LevelProgress);
