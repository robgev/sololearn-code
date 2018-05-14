// React modules
import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

// Material UI components
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

// Redux modules
import {
	getContests,
	clearContestsInternal,
	chooseContestCourse,
} from 'actions/challenges';
import { isLoaded } from 'reducers';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import ContestItem from './ContestItem';
import PlayShimmer from 'components/Shared/Shimmers/PlayShimmer';

// i18next
import { translate } from 'react-i18next';

const styles = {
	contests: {
		padding: 0,
	},

	header: {
		base: {
			backgroundColor: '#e8e8e8',
			padding: '10px',
		},

		title: {
			fontSize: '14px',
			color: '#777',
		},
	},

	headerWithAction: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0 0 0 10px',
		backgroundColor: '#e8e8e8',
	},

	headerButton: {
		marign: '0 5px 0 0',
	},

	newChallengeButton: {
		position: 'fixed',
		bottom: 20,
		right: 20,
	},

	coursesPopup: {
		width: '40%',
	},

	coursesTitle: {
		fontSize: '20px',
		padding: '24px 24px 10px',
	},

	course: {
		display: 'flex',
		alignItems: 'center',
		margin: '10px 0',
	},

	courseIcon: {
		width: '40px',
		margin: '0 10px 0 0',
		display: 'inline-block',
		verticalAlign: 'middle',
	},

	courseName: {
		margin: '0 0 5px 0',
	},
};

class Contests extends PureComponent {
	constructor() {
		super();
		this.state = {
			selectCourse: false,
		};
		document.title = 'Sololearn | Contests';
	}

	componentDidMount() {
		this.props.getContests();
		ReactGA.ga('send', 'screenView', { screenName: 'Play Page' });
	}

	openCoursePopup = () => {
		ReactGA.ga('send', 'screenView', { screenName: 'Play Selection Page' });
		this.setState({ selectCourse: true });
	}

	closeCoursePopup = () => {
		this.setState({ selectCourse: false });
	}

	chooseContestCourse = (courseId) => {
		this.props.chooseContestCourse(courseId);
		browserHistory.push('/choose-opponent');
	}

	renderContests = (contests) => {
		const { courses } = this.props;
		return contests.map((contest) => {
			const courseName = courses.find(item => item.id === contest.courseID).languageName;
			return (
				<ContestItem
					key={contest.id}
					contest={contest}
					contestId={contest.id}
					courseName={courseName}
				/>
			);
		});
	}

	renderCourses = () => this.props.courses
		.map(course => (!course.isPlayEnabled ? null : (
			<div
				tabIndex={0}
				role="button"
				key={course.id}
				style={styles.course}
				onClick={() => { this.chooseContestCourse(course.id); }}
				onKeyDown={e => (e.key === 'Enter' ? this.chooseContestCourse(course.id) : null)}
			>
				<img
					src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`}
					alt={course.name}
					style={styles.courseIcon}
				/>
				<p style={styles.courseName}>{course.languageName}</p>
			</div>
		)))

	render() {
		const {
			t,
			contests,
			clearContests,
			isContestsLoaded,
		} = this.props;
		const {
			invited,
			ongoing,
			completed,
		} = contests || {};
		if (!isContestsLoaded) {
			return (
				<Layout>
					<PlayShimmer />
				</Layout>
			);
		}
		return (
			<Layout>
				<Paper id="contests">
					{
						invited && invited.length > 0 &&
							<div>
								<p style={{ ...styles.header.base, ...styles.header.title }}>{t('play.section.invites')}</p>
								<List style={styles.contests}>{this.renderContests(invited)}</List>
							</div>
					}
					{
						invited && ongoing.length > 0 &&
							<div>
								<p style={{ ...styles.header.base, ...styles.header.title }}>{t('play.section.ongoing')}</p>
								<List style={styles.contests}>{this.renderContests(ongoing)}</List>
							</div>
					}
					{
						invited && completed.length > 0 &&
							<div>
								<div style={styles.headerWithAction}>
									<p style={styles.header.title}>{t('play.section.completed')}</p>
									<FlatButton label={t('play.clear-challenges-button-title')} style={styles.headerButton} onClick={clearContests} />
								</div>
								<List style={styles.contests}>{this.renderContests(completed)}</List>
							</div>
					}
					<Dialog
						id="courses"
						modal={false}
						autoScrollBodyContent
						title="Choose your weapon"
						open={this.state.selectCourse}
						titleStyle={styles.coursesTitle}
						contentStyle={styles.coursesPopup}
						onRequestClose={this.closeCoursePopup}
					>
						{this.renderCourses()}
					</Dialog>
					<FloatingActionButton
						secondary
						zDepth={3}
						onClick={this.openCoursePopup}
						style={styles.newChallengeButton}
					>
						<ContentAdd />
					</FloatingActionButton>
				</Paper>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	isContestsLoaded: isLoaded(state, 'contests'),
	contests: state.challenges.contests,
	courses: state.courses,
});

const mapDispatchToProps = {
	getContests,
	clearContests: clearContestsInternal,
	chooseContestCourse,
};

const translateContests = translate()(Contests);

export default connect(mapStateToProps, mapDispatchToProps)(translateContests);
