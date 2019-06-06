import React, { Component, createRef } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import uniqBy from 'lodash/uniqBy';
import {
	PaperContainer, Heading, FlexBox,
	Select, MenuItem, Popup, PopupActions, PopupTitle, PopupContent,
} from 'components/atoms';
import { FlatButton, RaisedButton, InfiniteScroll } from 'components/molecules';
import { browserHistory } from 'react-router';
import { queryDifference, isObjectEqual } from 'utils';
import Quiz, { CheckBar } from 'components/Quiz';
import Layout from '../Layout';
import ChallengesList from './ChallengesList';
import { getMySubmissions, deleteChallenge } from '../api';
import './mySubmissionsStyles.scss';

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
		throw new Error('Can\'t identify type of submitted challenge');
	}
};

const mapStateToProps = ({ courses }) => ({ courses });

@translate()
@connect(mapStateToProps)
class MySubmissions extends Component {
	static DEFAULT_FILTERS = {
		count: 20, courseId: 0, status: 0, id: null,
	}

	constructor(props) {
		super(props);
		this.state = {
			challenges: [],
			hasMore: true,
			isFetching: false,
			hasHighlighted: false,
			previewChallenge: null,
			checkResult: null,
			isDeletePopupOpen: false,
			filters: MySubmissions.DEFAULT_FILTERS,
		};
	}

	challengesList = createRef();

	componentWillMount() {
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
	componentDidUpdate() {
		const { filters, challenges, hasHighlighted } = this.state;
		if (challenges.length !== 0 && !hasHighlighted) {
			this.scrollToID(filters.id);
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({ hasHighlighted: true });
		}
	}
	scrollToID = (id) => {
		if (this.challengesList) {
			this.challengesList.current.scrollToID(id);
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
		if (filters.id) {
			formattedFilters.id = parseInt(filters.id, 10);
		}
		const keys = Object.keys(formattedFilters);
		if (keys.length === 0 || keys.some(key => formattedFilters[key] !== oldFilters[key])) {
			this.setState({
				filters: { ...MySubmissions.DEFAULT_FILTERS, ...formattedFilters },
				challenges: [],
			}, () => {
				this.fetchSubmissions();
			});
		}
	};
	fetchSubmissions = async () => {
		const { challenges, filters, isFetching } = this.state;
		if (!isFetching) {
			const index = challenges.length;
			this.setState({ isFetching: true });
			const newChallenges = await getMySubmissions({ ...filters, index });
			if (this._isMounted) {
				if (newChallenges.length === 0) {
					this.setState({ hasMore: false });
				}
				this.setState(s => ({
					isFetching: false,
					challenges: uniqBy([ ...s.challenges, ...newChallenges ], 'id'),
				}));
			}
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
		browserHistory.push({
			pathname: `/quiz-factory/suggest/${getStringFromType(previewChallenge.type)}`,
			state: { init: previewChallenge },
		});
	}
	handleDelete = () => {
		const { id } = this.state.previewChallenge;
		this.setState(s => ({
			previewChallenge: null,
			isDeletePopupOpen: false,
			challenges: s.challenges.filter(challenge => challenge.id !== id),
		}));
		return deleteChallenge(id);
	}
	hanldeStatusFilterChange = (e) => {
		const status = e.target.value;
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, status } });
	}
	handleCourseIdFilterChange = (e) => {
		const courseId = e.target.value;
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
		const { t } = this.props;
		if (checkResult === null) {
			return t('learn.buttons-check');
		}
		return t('common.try-again-title');
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
			challenges, previewChallenge, checkResult,
			isQuizComplete, hasMore, isFetching, filters,
			isDeletePopupOpen,
		} = this.state;
		const { courses, t } = this.props;
		return (
			<Layout className="quiz_factory-my-submissions">
				<InfiniteScroll
					hasMore={hasMore}
					isLoading={isFetching}
					loadMore={this.fetchSubmissions}
				>
					<PaperContainer>
						<FlexBox className="toolbar" align justifyBetween>
							<Heading>{t('factory.my_submissions')}</Heading>
							<FlexBox align>
								<Select
									className="select"
									value={filters.status}
									onChange={this.hanldeStatusFilterChange}
								>
									<MenuItem value={0}>{t('factory.submission-all')}</MenuItem>
									<MenuItem value={1}>{t('factory.submission-pending')}</MenuItem>
									<MenuItem value={2}>{t('factory.submission-declined')}</MenuItem>
									<MenuItem value={3}>{t('factory.submission-approved')}</MenuItem>
								</Select>
								<Select
									value={filters.courseId}
									onChange={this.handleCourseIdFilterChange}
								>
									<MenuItem value={0}>{t('factory.submission-all')}</MenuItem>
									{
										courses
											.filter(course => course.isQuizFactoryEnabled)
											.map(course =>
												<MenuItem key={course.id} value={course.id}>{course.language}</MenuItem>)
									}
								</Select>
							</FlexBox>
						</FlexBox>
						<ChallengesList
							ref={this.challengesList}
							challenges={challenges}
							isLoading={isFetching}
							courses={courses}
							preview={this.preview}
						/>
					</PaperContainer>
				</InfiniteScroll>
				<Popup
					open={previewChallenge !== null}
					onClose={this.closePreview}
				>
					{previewChallenge !== null
						? (
							<PopupContent>
								<Quiz
									quiz={previewChallenge}
									onChange={this.checkComplete}
									disabled={checkResult !== null}
									ref={(q) => { this.quiz = q; }}
								/>
								<CheckBar
									onClick={this.checkBarOnClick}
									disabled={!isQuizComplete}
									secondary
									label={this.checkBarLabel}
									status={checkResult}
								/>
							</PopupContent>
						)
						: null}
					<PopupActions>
						<FlatButton onClick={this.closePreview} color="primary">
							{t('common.cancel-title')}
						</FlatButton>
						{previewChallenge !== null && previewChallenge.status === 2
							? (
								<FlatButton
									onClick={this.toggleDeletePopup}
									className="quiz_factory-my-submissions-delete-button"
								>
									{t('common.delete-title')}
								</FlatButton>
							)
							: null}
						{previewChallenge !== null && previewChallenge.status === 2
							? (
								<RaisedButton
									onClick={this.handleEdit}
									color="primary"
									autoFocus
								>
									{t('common.edit-action-title')}
								</RaisedButton>
							)
							: null}
						{previewChallenge !== null && previewChallenge.status === 3
							? (
								<RaisedButton
									onClick={this.handleEdit}
									color="primary"
									autoFocus
								>
									{t('factory.action-clone')}
								</RaisedButton>
							)
							: null}
					</PopupActions>
				</Popup>
				<Popup
					open={isDeletePopupOpen}
					onClose={this.toggleDeletePopup}
				>
					<PopupTitle>
						{t('factory.delete-submission-title')}
					</PopupTitle>
					<PopupContent>
						{t('factory.delete-submission-message')}
					</PopupContent>
					<PopupActions>
						<FlatButton
							onClick={this.toggleDeletePopup}
							color="primary"
						>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton
							onClick={this.handleDelete}
						>
							{t('common.delete-title')}
						</FlatButton>
					</PopupActions>
				</Popup>
			</Layout>
		);
	}
}

export default MySubmissions;
