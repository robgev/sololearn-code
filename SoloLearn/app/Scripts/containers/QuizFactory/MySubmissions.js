import React, { Component } from 'react';
import { List, ListItem, Paper } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';
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
	question, status, type, id,
}) => (
	<ListItem key={id}>
		<p>{question}</p>
		<p>{getTypeString(type)}</p>
		<p>{getStatusString(status)}</p>
	</ListItem>
);

class MySubmissions extends Component {
	state = {
		challenges: [],
	}
	async componentWillMount() {
		const challenges = await getMySubmissions();
		this.setState({ challenges });
	}
	render() {
		const { challenges } = this.state;
		return (
			<Layout>
				<Paper>
					<List>
						{challenges.map(ChallengePreview)}
					</List>
				</Paper>
			</Layout>
		);
	}
}

export default MySubmissions;
