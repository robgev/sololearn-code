import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Paper, Dialog, FlatButton, RaisedButton } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';
import Quiz from 'components/Shared/Quiz';
import { getMySubmissions } from './api';

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

const getStatusString = (status) => {
	switch (status) {
	case 1:
		return 'Pending';
	case 2:
		return 'Declined';
	case 3:
		return 'Approved';
	default:
		throw new Error('Can\'t identify status of submitted challenge');
	}
};

const ChallengePreview = ({
	onClick, ...quiz
}) => (
	<ListItem onClick={() => onClick(quiz)}>
		<p>{quiz.question}</p>
		<p>{getTypeString(quiz.type)}</p>
		<p>{getStatusString(quiz.status)}</p>
	</ListItem>
);

class MySubmissions extends Component {
	state = {
		challenges: [],
		previewChallenge: null,
	}
	async componentWillMount() {
		const challenges = await getMySubmissions();
		this.setState({ challenges });
	}
	preview = (challenge) => {
		this.setState({ previewChallenge: challenge });
	}
	closePreview = () => {
		this.setState({ previewChallenge: null });
	}
	handleEdit = () => {

	}
	render() {
		const { challenges, previewChallenge } = this.state;
		const actions = [
			<FlatButton onClick={this.closePreview} label="Cancel" primary />,
			<RaisedButton
				onClick={this.handleSubmit}
				label="Edit"
				primary
				disabled={previewChallenge !== null && previewChallenge.type !== 2}
			/>,
		];
		return (
			<Layout>
				<Paper>
					<List>
						{challenges.map(el => <ChallengePreview key={el.id} {...el} onClick={this.preview} />)}
					</List>
				</Paper>
				<Dialog
					open={previewChallenge !== null}
					actions={actions}
					onRequestClose={this.closePreview}
				>
					{previewChallenge !== null ? <Quiz quiz={previewChallenge} canTryAgain /> : null}
				</Dialog>
			</Layout>
		);
	}
}

export default MySubmissions;
