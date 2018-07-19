import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uniqBy } from 'lodash';
import {
	Paper, Dialog,
	FlatButton, RaisedButton,
	DropDownMenu, MenuItem,
} from 'material-ui';
import { red500 } from 'material-ui/styles/colors';
import { browserHistory } from 'react-router';
import Layout from 'components/Layouts/GeneralLayout';
import Quiz, { CheckBar } from 'components/Quiz';
import { setSuggestionChallenge } from 'actions/quizFactory';
import ChallengesList from './ChallengesList';
import { getMySubmissions, deleteChallenge } from '../api';
import './mySubmissionsStyles.scss';
import actionContainerStyle from '../components/actionContainerStyle';

// Utility funcs

const equal = (obj1, obj2) => !Object.keys(obj1).some(key => obj1[key] !== obj2[key]);

const getStringFromType = (type) => {
	switch (type) {
	case 1:
		return 'multiple-choice';
	case 2:
		return 'type-in';
	case 3:
		return 'fill-in';
	default:
		throw new Error('Can\'t identiry type of submitted challenge');
	}
};

const mapStateToProps = ({ courses }) => ({ courses });

const mapDispatchToProps = {
	setSuggestionChallenge,
};

@connect(mapStateToProps, mapDispatchToProps)
class MySubmissions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			challenges: null,
			hasMore: true,
			previewChallenge: null,
			checkResult: null,
			isDeletePopupOpen: false,
			filters: {
				courseId: null,
				status: null,
			},
		};
		document.title = 'Sololearn | My Submissions';
	}
	componentWillMount() {
		this._isMounted = true;
		const { status = null, courseId = null } = this.props.location.query;
		this.setState({
			filters: {
				status: status === null ? null : parseInt(status, 10),
				courseId: courseId === null ? null : parseInt(courseId, 10),
			},
		});
		this.fetchSubmissions({ status, courseId }, null);
	}
	componentDidUpdate(nextProps) {
		const { filters } = this.state;
		const { query: currQuery } = this.props.location;
		const { query: nextQuery } = nextProps.location;
		const statusChanged = currQuery.status !== nextQuery.status;
		const courseIdChanged = currQuery.courseId !== nextQuery.courseId;
		if (courseIdChanged) {
			filters.courseId = currQuery.courseId === null ? null : parseInt(currQuery.courseId, 10);
		}
		if (statusChanged) {
			filters.status = currQuery.status === null ? null : parseInt(currQuery.status, 10);
		}
		if (statusChanged || courseIdChanged) {
			// eslint-disable-next-line
			this.setState({ filters, challenges: null });
			this.fetchSubmissions(filters, null);
		}
	}
	fetchSubmissions = async (filters = this.state.filters, challenges = this.state.challenges) => {
		const index = challenges !== null ? challenges.length : 0;
		const newChallenges = await getMySubmissions({ ...filters, index });
		if (this._isMounted) {
			if (newChallenges.length === 0) {
				this.setState({ hasMore: false });
			}
			this.setState(s => ({
				challenges: s.challenges === null
					? newChallenges
					: uniqBy([ ...s.challenges, ...newChallenges ], 'id'),
			}));
		}
	}
	preview = (challenge) => {
		this.setState({ previewChallenge: challenge });
	}
	closePreview = () => {
		this.setState({ previewChallenge: null, checkResult: null });
	}
	handleEdit = () => {
		const { previewChallenge } = this.state;
		this.props.setSuggestionChallenge(previewChallenge);
		browserHistory.push(`/quiz-factory/suggest/${getStringFromType(previewChallenge.type)}`);
	}
	handleDelete = () => {
		const { id } = this.state.previewChallenge;
		this.setState(s => ({
			previewChallenge: null,
			isDeletePopupOpen: false,
			challenges: s.challenges.filter(challenge => challenge.id !== id),
		}));
		deleteChallenge(id);
	}
	hanldeStatusFilterChange = (_, __, status) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, status } });
	}
	handleCourseIdFilterChange = (_, __, courseId) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, courseId } });
	}
	toggleDeletePopup = () => {
		this.setState(s => ({ isDeletePopupOpen: !s.isDeletePopupOpen }));
	}
	checkComplete = ({ isComplete }) => {
		this.setState({ isQuizComplete: isComplete });
	}
	onQuizButtonClick = () => {
		const { checkResult } = this.state;
		if (checkResult === null) {
			this.setState({ checkResult: this.quiz.check() });
		}
	}
	check = () => {
		this.setState({ checkResult: this.quiz.check() });
	}
	tryAgain = () => {
		this.quiz.tryAgain();
		this.setState({ checkResult: null, isQuizComplete: false });
	}
	get checkBarLabel() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return 'Check';
		}
		return 'Try again';
	}
	get checkBarOnClick() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return this.check;
		}
		return this.tryAgain;
	}
	render() {
		const {
			challenges, previewChallenge, checkResult, isQuizComplete, hasMore,
		} = this.state;
		const { courses } = this.props;
		const actions = [
			<FlatButton onClick={this.closePreview} label="Cancel" primary />,
			previewChallenge !== null && previewChallenge.status === 2
				? <FlatButton
					label="Delete"
					onClick={this.toggleDeletePopup}
					labelStyle={{ color: red500 }}
				/> : null,
			previewChallenge !== null && previewChallenge.status === 2
				? <RaisedButton
					label="Edit"
					onClick={this.handleEdit}
					primary
				/> : null,
			previewChallenge !== null && previewChallenge.status === 3
				? <RaisedButton
					label="Clone"
					onClick={this.handleEdit}
					primary
				/> : null,
		];
		return (
			<Layout className="my-submissions">
				<Paper className="status-bar">
					<span style={{ marginTop: 5 }}>Status:</span>
					<DropDownMenu
						value={this.state.filters.status}
						onChange={this.hanldeStatusFilterChange}
					>
						<MenuItem value={null} primaryText="All" />
						<MenuItem value={1} primaryText="Pending" />
						<MenuItem value={2} primaryText="Declined" />
						<MenuItem value={3} primaryText="Approved" />
					</DropDownMenu>
					<DropDownMenu
						value={this.state.filters.courseId}
						onChange={this.handleCourseIdFilterChange}
					>
						<MenuItem value={null} primaryText="All" />
						{
							this.props.courses
								.filter(course => course.isQuizFactoryEnabled)
								.map(course =>
									<MenuItem key={course.id} value={course.id} primaryText={course.language} />)
						}
					</DropDownMenu>
				</Paper>
				<ChallengesList
					challenges={challenges}
					courses={courses}
					loadMore={this.fetchSubmissions}
					hasMore={hasMore}
					preview={this.preview}
				/>
				<Dialog
					open={previewChallenge !== null}
					actions={actions}
					onRequestClose={this.closePreview}
					actionsContainerStyle={actionContainerStyle}
				>
					{previewChallenge !== null ? (
						<div>
							<Paper>
								<Quiz
									quiz={previewChallenge}
									onChange={this.checkComplete}
									disabled={checkResult !== null}
									ref={(q) => { this.quiz = q; }}
								/>
							</Paper>
							<CheckBar
								onClick={this.checkBarOnClick}
								disabled={!isQuizComplete}
								secondary
								label={this.checkBarLabel}
								status={this.state.checkResult}
							/>
							<Dialog
								title="Delete Submission"
								contentStyle={{ width: '50%' }}
								open={this.state.isDeletePopupOpen}
								actions={[
									<FlatButton label="cancel" onClick={this.toggleDeletePopup} primary />,
									<FlatButton label="delete" onClick={this.handleDelete} labelStyle={{ color: red500 }} />,
								]}
								onRequestClose={this.toggleDeletePopup}
							>
								Are you sure?
							</Dialog>
						</div>
					) : null}
				</Dialog>
			</Layout >
		);
	}
}

export default MySubmissions;
