import React from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import PolarChart from 'components/Shared/PolarChart';

import { calculateProgress } from 'utils';
import chartColors from 'constants/ChartColors';
import 'styles/Profile/skills.scss';
import SkillChip from './SkillChip';

const createChartData = ranks => Object.keys(ranks)
	.sort((currentItem, comparedItem) => ranks[comparedItem] - ranks[currentItem])
	.map((key, index) => ({
		x: index,
		label: key,
		percentage: ranks[key],
		fill: chartColors[index],
		y: (Math.sqrt(ranks[key]) * 50) + 50,
	}));

const Skills = ({ levels, profile, skills }) => {
	const { maxXp, status } = calculateProgress(levels, profile.level, profile.xp);
	return (
		<div className="skills-container">
			<Paper className="skills-group">
				<p className="skills-header">Status + Rank</p>
				<div className="skills-details">
					<Link to="/leaderboard" className="leaderboard-link">
							Check out the leaderboard
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
				<p className="skills-header">Languages</p>
				<div className={`courses ${skills.length <= 0 ? 'centered' : ''}`}>
					{skills.length > 0 ?
						skills.map(course =>
							<SkillChip key={course.id} course={course} />) :
						<p>Nothing to show</p>
					}
				</div>
			</Paper>
			<Paper className="skills-group">
				<p className="skills-header">Skills</p>
				<PolarChart chartData={createChartData(profile.skillRanks)} />
			</Paper>
		</div>
	);
};

export default Skills;
