import React, { Component } from 'react';
import { connect } from 'react-redux';
import uniqBy from 'lodash/uniqBy';
import Paper from 'material-ui/Paper';
import Dialog from 'components/StyledDialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { red500 } from 'material-ui/styles/colors';
import { browserHistory } from 'react-router';
import { queryDifference, isObjectEqual } from 'utils';
import Layout from 'components/Layouts/GeneralLayout';
import Quiz, { CheckBar } from 'components/Quiz';
import { setSuggestionChallenge } from 'actions/quizFactory';
import ChallengesList from './ChallengesList';
import { getMySubmissions, deleteChallenge } from '../api';
import './mySubmissionsStyles.scss';
import actionContainerStyle from '../components/actionContainerStyle';

// Utility funcs

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
	static DEFAULT_FILTERS = { courseId: null, status: null }

	constructor(props) {
		super(props);
		this.state = {
			challenges: null,
			hasMore: true,
			previewChallenge: null,
			checkResult: null,
			isDeletePopupOpen: false,
			filters: MySubmissions.DEFAULT_FILTERS,
		};
	}
	componentDidMount() {
		document.title = 'Sololearn | Discuss';
		this._isMounted = true;
		const { location } = this.props;
		this.setFilters(location.query);
		const changed = queryDifference(MySubmissions.DEFAULT_FILTERS, location.query);
		browserHistory.replace({ ...location, query: changed });
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the route
		const { location } = nextProps;
		if (!isObjectEqual(location.query, this.props.location.query)) {
			const changed = queryDifference(MySubmissions.DEFAULT_FILTERS, location.query);
			browserHistory.push({ ...location, query: changed });
			this.setFilters(location.query);
		}
	}
	setFilters = (filters) => {
		const { filters: oldFilters } = this.state;
		const formattedFilters = { ...filters };
		if (filters.courseId) {
			formattedFilters.courseId = parseInt(filters.courseId, 10);
		}
		if (filters.status) {
			formattedFilters.status = parseInt(filters.status, 10);
		}
		const keys = Object.keys(formattedFilters);
		if (keys.length === 0 || keys.some(key => formattedFilters[key] !== oldFilters[key])) {
			this.setState({
				filters: { ...MySubmissions.DEFAULT_FILTERS, ...formattedFilters },
				challenges: null,
			});
			this.fetchSubmissions(filters, null);
		}
	};
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
			</Layout>
		);
	}
}

export default MySubmissions;
