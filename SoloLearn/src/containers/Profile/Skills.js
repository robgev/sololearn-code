import React, { PureComponent } from 'react';
import PolarChart from 'components/PolarChart';
import ChallengeGraphs from 'components/ChallengeGraphs';
import LeaderboardString from 'components/LeaderboardString';
import {
	getCountryName,
	calculateProgress,
	determineBadge,
} from 'utils';
import {
	Container,
	PaperContainer,
	Title,
	Image,
	TextBlock,
	SecondaryTextBlock,
	Select,
	MenuItem,
	ModBadgeIcon,
} from 'components/atoms';
import { ProgressBar } from 'components/molecules';
import i18n from 'i18n';
import { translate } from 'react-i18next';
import { PolarChartColors } from 'constants/ChartColors';
import LanguageCodes from 'constants/LanguageCodes';
import SkillChip from './SkillChip';

import 'styles/Profile/skills.scss';

const getTranslatedLabel = (label) => {
	switch (label) {
	case 'learner':
		return i18n.t('skills.chart-learner');
	case 'contributor':
		return i18n.t('skills.chart-contributor');
	case 'influencer':
		return i18n.t('skills.chart-influencer');
	case 'challenger':
		return i18n.t('skills.chart-challenger');
	case 'coder':
		return i18n.t('skills.chart-coder');
	default:
		return label;
	}
};

const createChartData = ranks => Object.keys(ranks)
	.sort((currentItem, comparedItem) => ranks[comparedItem] - ranks[currentItem])
	.map((key, index) => ({
		x: index,
		label: getTranslatedLabel(key),
		percentage: ranks[key],
		fill: PolarChartColors[key],
		y: (Math.sqrt(ranks[key]) * 50) + 50,
	}));

const ModeratorStatus = ({ badge, t }) => {
	const { modBadge } = determineBadge(badge);
	const hasCrown = modBadge === 'gold_mod' || modBadge === 'platinum_mod';
	return !modBadge ? null
		:
		<Container>
			<ModBadgeIcon className="mode-badge-icon" mode="primary" />
			{t(`skills.${modBadge}`)}
		</Container>;
};

@translate()
class Skills extends PureComponent {
	state = {
		courseID: '',
	}

	handleCourseChange = event => this.setState({ courseID: event.target.value });

	render() {
		const { courseID } = this.state;
		const {
			t,
			skills,
			levels,
			profile,
			currentUserId,
		} = this.props;
		const { maxXp, status, currentStatus, levelsToNext } = calculateProgress(levels, profile.level, profile.xp);
		if (!skills) {
			return null;
		}
		
		return (
			<Container className="skills-container">
				<PaperContainer className="skills-group">
					<Title>{t('skills.status-plus-rank')}</Title>
					<ModeratorStatus t={t} badge={profile.badge} />
					<Container className="skills-details">
						<LeaderboardString userID={profile.id} ranks={profile.rank} />
						<Container className="country-details">
							<Image
								alt={profile.countryCode}
								style={{ height: 'initial', width: 26 }}
								src={`/assets/flags/${profile.countryCode.toLowerCase()}.png`}
							/>
							<TextBlock className="country-name">
								{ getCountryName(profile.countryCode) }
							</TextBlock>
						</Container>
						<Container className="skills-progress-wrapper">
							<ProgressBar
								value={100 * profile.xp / maxXp}
								className="progress"
								minText={t(`profile.status-${currentStatus}`)}
								maxText={t(`profile.status-${status}`)}
							/>
							{
								levelsToNext && (
									<Container className="levels-to-next">
										<SecondaryTextBlock>
											{`${levelsToNext} ${levelsToNext === 1 ? t('profile.status-text-one') : t('profile.status-text-other')} ${t(`profile.status-${status}`)}` }
										</SecondaryTextBlock>
									</Container>
								)
							}
							
						</Container>
					</Container>
				</PaperContainer>
				<PaperContainer className="skills-group">
					<Title>{t('skills.languages')}</Title>
					<Container className={`courses ${skills.length <= 0 ? 'centered' : ''}`}>
						{skills.length > 0 ?
							skills.map(course => (
								<SkillChip
									key={course.id}
									course={course}
									shouldShowLink={profile.id === currentUserId}
								/>
							)) :
							<TextBlock>{t('common.empty-list-message')}</TextBlock>
						}
					</Container>
				</PaperContainer>
				<PaperContainer className="skills-group">
					<Title>{t('skills.skills-section-title')}</Title>
					<PolarChart chartData={createChartData(profile.skillRanks)} />
				</PaperContainer>
				<PaperContainer className="skills-group">
					<Container className="skills-row">
						<Title className="skills-header">{t('skills.challenges-section-title')}</Title>
						<Select
							displayEmpty
							value={courseID}
							onChange={this.handleCourseChange}
						>
							<MenuItem value="">
								{t('code.language-filter.all')}
							</MenuItem>
							{ profile.contestStats.map(({ courseID: currentCourseID }) =>
								(<MenuItem value={currentCourseID}>
									{LanguageCodes[currentCourseID]}
         </MenuItem>) )}
						</Select>
					</Container>
					<ChallengeGraphs
						courseID={courseID}
						contestStats={profile.contestStats}
						contestHistory={profile.contestHistory}
					/>
				</PaperContainer>
			</Container>
		);
	}
}

export default Skills;
