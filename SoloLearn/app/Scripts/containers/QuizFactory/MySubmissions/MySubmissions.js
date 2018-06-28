import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Paper, Dialog, FlatButton, RaisedButton } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';
import Quiz from 'components/Shared/Quiz';
import { getMySubmissions } from '../api';
import './mySubmissionsStyles.scss';

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
			<Layout className="my-submissions">
				<Paper>
					<List>
						{challenges.map(quiz => (
							<ListItem
								onClick={() => this.preview(quiz)}
								className="preview"
								leftIcon={
									<img
										style={{
											width: 36,
											height: 36,
											margin: '7px 0 0 12px',
										}}
										src={`https://api.sololearn.com/uploads/Courses/${quiz.courseID}.png`}
										alt=""
									/>
								}
								rightIcon={
									<div
										className="status"
										style={{ height: 'initial', width: 80, backgroundColor: getStatus(quiz.status).color }}
									>
										{getStatus(quiz.status).text}
									</div>
								}
								primaryText={<div className="primary-text">{quiz.question}</div>}
								key={quiz.id}
								secondaryText={getTypeString(quiz.type)}
							/>
						))}
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
