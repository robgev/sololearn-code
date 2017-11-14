// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Material UI components
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import ProgressBar from 'react-progressbar.js';
// Utils and defaults
import getStyles from '../../utils/styleConverter';

const { Circle } = ProgressBar;

const styles = {
	container: {
		margin: '5px 0 0 0',
		padding: '10px',
	},

	heading: {
		textTransform: 'uppercase',
	},

	leaderboardLink: {
		fontSize: '12px',
		fontWeight: 500,
		textDecoration: 'none',
		color: '#607d8b',
		margin: '5px 0',
		display: 'block',
	},

	progressWrapper: {
		textAlign: 'right',
	},

	status: {
		fontSize: '11px',
		color: '#777',
	},

	progress: {
		backgroundColor: '#dedede',
	},

	circleProgress: {
		width: '75px',
		height: '75px',
	},

	courses: {
		base: {
			display: 'flex',
			margin: '10px 0 0 0',
			flexWrap: 'wrap',
			minHeight: '100px',
		},

		centered: {
			justifyContent: 'center',
			alignItems: 'center',
		},
	},

	course: {
		flexGrow: '1 1 auto',
		width: '33%',
		display: 'inline-flex',
		alignItems: 'center',
		margin: '0 0 10px 0',
	},

	courseProgress: {
		position: 'relative',
	},

	courseIcon: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '60px',
		height: '60px',
		margin: '-30px 0 0 -30px',
		borderRadius: '50%',
	},

	courseDetails: {
		margin: '0 0 0 10px',
		fontWeight: 500,
	},

	courseName: {
		fontSize: '14px',
	},

	xp: {
		fontSize: '13px',
		color: '#777',
	},

	noSkills: {

	},
};

const progressBarOptions = {
	color: '#37474F',
	strokeWidth: 5,
	trailColor: '#E0E0E0',
	trailWidth: 5,
};

class Skills extends Component {
	renderCourses() {
		const { skills } = this.props;

		return skills.map(course => (
			<div className="course" key={course.id} style={styles.course}>
				<div className="course-progress" style={styles.courseProgress}>
					<Circle
						progress={course.progress}
						options={progressBarOptions}
						containerStyle={styles.circleProgress}
					/>
					<img src="../../../assets/1051.png" alt={course.name} style={styles.courseIcon} />
				</div>
				<div className="course-details" style={styles.courseDetails}>
					<p style={styles.courseName}>{course.languageName}</p>
					<p style={styles.xp}>{course.xp} XP</p>
				</div>
			</div>
		));
	}

	render() {
		const { levels, profile } = this.props;

		const userLevel = profile.level;
		const currentXp = profile.xp;
		let maxXp = null;
		let status = '';
		const levelsWithStatus = levels.filter(item => item.status != null);
		const levelsWithStatusLength = levelsWithStatus.length;

		// TODO Write a comment
		if (userLevel >= levelsWithStatus[levelsWithStatusLength - 1].number) {
			maxXp = currentXp;
			status = levelsWithStatus[levelsWithStatusLength - 1].status;
		} else {
			for (let i = userLevel; i < levels.length - 1; i++) {
				const currentLevel = levels[i];

				if (currentLevel.status != null) {
					maxXp = levels[i - 1].maxXp;
					status = currentLevel.status;
					break;
				}
			}
		}

		return (
			<div id="skills">
				<Paper className="skills-header" style={styles.container}>
					<p style={styles.heading}>Status + Rank</p>
					<div className="details" style={styles.details}>
						<Link to="/leaderboard" style={styles.leaderboardLink}>Check out the leaderboard</Link>
						<div style={styles.progressWrapper}>
							<LinearProgress style={styles.progress} mode="determinate" min={0} max={maxXp} value={currentXp} color="#8BC34A" />
							<span style={styles.status}>{status}</span>
						</div>
					</div>
				</Paper>
				<Paper className="skills-languages" style={styles.container}>
					<p style={styles.heading}>Languages</p>
					<div
						style={this.props.skills.length > 0 ?
							styles.courses.base :
							getStyles(styles.courses.base, styles.courses.centered)}
					>
						{
							this.props.skills.length > 0 ?
								this.renderCourses()
								: <p style={styles.noSkills}>Nothing to show</p>
						}
					</div>
				</Paper>
			</div>
		);
	}
}

export default Skills;
