import React, { PureComponent } from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import LinearProgress from 'material-ui/LinearProgress';
import PolarChart from 'components/Shared/PolarChart';
import ChallengeGraphs from 'components/Shared/ChallengeGraphs';

import { calculateProgress } from 'utils';
import { PolarChartColors } from 'constants/ChartColors';
import LanguageCodes from 'constants/LanguageCodes';
import 'styles/Profile/skills.scss';
import SkillChip from './SkillChip';

const createChartData = ranks => Object.keys(ranks)
	.sort((currentItem, comparedItem) => ranks[comparedItem] - ranks[currentItem])
	.map((key, index) => ({
		x: index,
		label: key,
		percentage: ranks[key],
		fill: PolarChartColors[key],
		y: (Math.sqrt(ranks[key]) * 50) + 50,
	}));

class Skills extends PureComponent {
	state = {
		courseID: null,
	}

	handleCourseChange = (event, index, value) => this.setState({ courseID: value });

	render() {
		const { courseID } = this.state;
		const { levels, profile, skills } = this.props;
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
				<Paper className="skills-group">
					<div className="skills-row">
						<p className="skills-header">Challenges</p>
						<DropDownMenu
							value={courseID}
							onChange={this.handleCourseChange}
						>
							<MenuItem value={null} primaryText="All" />
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
