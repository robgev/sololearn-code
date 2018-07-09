import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, Paper, Dialog, FlatButton, RaisedButton } from 'material-ui';
import Subheader from 'material-ui/Subheader';
import { red500 } from 'material-ui/styles/colors';
import { browserHistory } from 'react-router';
import Layout from 'components/Layouts/GeneralLayout';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Quiz, { CheckBar } from 'components/Shared/Quiz';
import LanguageCard from 'components/Shared/LanguageCard';
import { setSuggestionChallenge } from 'actions/quizFactory';
import { getMySubmissions, deleteChallenge } from '../api';
import './mySubmissionsStyles.scss';
import actionContainerStyle from '../components/actionContainerStyle';

// Utility funcs

const getTypeString = (type) => {
	switch (type) {
	case 1:
		return 'Multiple Choice';
	case 2:
		return 'Guess the Output';
	case 3:
		return 'Fill in the Blank(s)';
	default:
		throw new Error('Can\'t identify type of submitted challenge');
	}
};

const getStatus = (status) => {
	switch (status) {
	case 1:
		return { text: 'Pending', color: '#BDBDBD' };
	case 2:
		return { text: 'Declined', color: '#D32F2F' };
	case 3:
		return { text: 'Approved', color: '#9CCC65' };
	default:
		throw new Error('Can\'t identify status of submitted challenge');
	}
};

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
			previewChallenge: null,
			checkResult: null,
			isDeletePopupOpen: false,
		};
		document.title = 'Sololearn | My Submissions';
	}
	componentWillMount() {
		this.fetchSubmissions();
	}
	fetchSubmissions = async () => {
		const challenges = await getMySubmissions();
		this.setState({ challenges });
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
		const { previewChallenge } = this.state;
		this.setState({ previewChallenge: null, isDeletePopupOpen: null });
		deleteChallenge(previewChallenge.id)
			.then(this.fetchSubmissions);
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
			challenges, previewChallenge, checkResult, isQuizComplete,
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
				{
					challenges === null
						? <LoadingOverlay />
						: challenges.length === 0
							? 'You have no submitted challenges'
							: (
								<Paper>
									<List style={{ padding: 0 }}>
										<Subheader>My Submissions</Subheader>
										{challenges.map(quiz => (
											<ListItem
												onClick={() => this.preview(quiz)}
												className="preview"
												leftIcon={
													<LanguageCard
														language={courses.find(c => c.id === quiz.courseID).language}
													/>
												}
												rightIcon={
													<div
														className="status"
														style={{ height: 'initial', width: 80, backgroundColor: getStatus(quiz.status).color }}
													>
														{getStatus(quiz.status).text.toUpperCase()}
													</div>
												}
												primaryText={<div className="primary-text">{quiz.question.replace(/\[!\w+!]/, '')}</div>}
												key={quiz.id}
												secondaryText={getTypeString(quiz.type)}
											/>
										))}
									</List>
								</Paper>
							)
				}
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
