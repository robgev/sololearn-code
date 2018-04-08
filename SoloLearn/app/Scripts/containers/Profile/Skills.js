import React, { PureComponent } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import LinearProgress from 'material-ui/LinearProgress';
import PolarChart from 'components/Shared/PolarChart';
import ChallengeGraphs from 'components/Shared/ChallengeGraphs';

// i18next
import i18n from 'i18n';
import { translate } from 'react-i18next';

import { calculateProgress } from 'utils';
import { PolarChartColors } from 'constants/ChartColors';
import LanguageCodes from 'constants/LanguageCodes';
import 'styles/Profile/skills.scss';
import SkillChip from './SkillChip';

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
		console.log(label);
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

const ModeratorStatus = ({ badge }) => {
	const splittedBadge = badge.split('|');
	return splittedBadge.length > 1 &&
	<div style={{ textTransform: 'uppercase' }}>{splittedBadge[0].split('_mod')[0]} Moderator</div>;
};

@translate()
class Skills extends PureComponent {
	state = {
		courseID: null,
	}

	handleCourseChange = (event, index, value) => this.setState({ courseID: value });

	render() {
		const { courseID } = this.state;
		const {
			t, levels, profile, skills,
		} = this.props;
		const { maxXp, status } = calculateProgress(levels, profile.level, profile.xp);
		return (
			<div className="skills-container">
				<Paper className="skills-group">
					<p className="skills-header">{t('skills.status-plus-rank')}</p>
					<ModeratorStatus badge={profile.badge} />
					<div className="skills-details">
						<Link to="/leaderboards" className="leaderboard-link">
							{t('leaderboard.rank.placeholder')}
						</Link>
						<div className="progress-wrapper">
							<LinearProgress
								min={0}
								max={maxXp}
								color="#8BC34A"
								value={profile.xp}
								mode="determinate"
								className="progress"
							/>
							<span className="status">{status}</span>
						</div>
					</div>
				</Paper>
				<Paper className="skills-group">
					<p className="skills-header">{t('skills.languages')}</p>
					<div className={`courses ${skills.length <= 0 ? 'centered' : ''}`}>
						{skills.length > 0 ?
							skills.map(course =>
								<SkillChip key={course.id} course={course} />) :
							<p>{t('common.empty-list-message')}</p>
						}
					</div>
				</Paper>
				<Paper className="skills-group">
					<p className="skills-header">{t('skills.skills-section-title')}</p>
					<PolarChart chartData={createChartData(profile.skillRanks)} />
				</Paper>
				<Paper className="skills-group">
					<div className="skills-row">
						<p className="skills-header">{t('skills.challenges-section-title')}</p>
						<DropDownMenu
							value={courseID}
							onChange={this.handleCourseChange}
						>
							<MenuItem value={null} primaryText={t('code.language-filter.all')} />
							{ profile.contestStats.map(({ courseID: currentCourseID }) =>
								<MenuItem value={currentCourseID} primaryText={LanguageCodes[currentCourseID]} />)}
						</DropDownMenu>
					</div>
					<ChallengeGraphs
						courseID={courseID}
						contestStats={profile.contestStats}
						contestHistory={profile.contestHistory}
					/>
				</Paper>
			</div>
		);
	}
}

export default Skills;
