import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import { RaisedButton } from 'material-ui';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import Quiz from 'components/Shared/Quiz';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import { getReviewChallenge, voteChallenge } from './api';
import './rateStyles.scss';

class Rate extends Component {
	state = {
		challenge: null,
		voteOpen: false,
	}
	async componentWillMount() {
		this.getChallenge();
	}
	like = () => {
		voteChallenge(this.state.challenge.id, 1);
		this.getChallenge();
	}
	dislike = () => {
		voteChallenge(this.state.challenge.id, -1);
		this.getChallenge();
	}
	getChallenge = async () => {
		this.setState({ voteOpen: false, challenge: null });
		const { courseId } = this.props.params;
		const challenge = await getReviewChallenge(courseId);
		this.setState({ challenge });
	}
	tryAgain = () => {
		this.setState({ voteOpen: false });
	}
	letVote = () => {
		this.setState({ voteOpen: true });
	}
	render() {
		const { challenge, voteOpen } = this.state;
		return (
			<Layout>
				{challenge !== null
					? <Quiz quiz={challenge} onCheck={this.letVote} canTryAgain onTryAgain={this.tryAgain} />
					: <div><LoadingOverlay /></div>}
				{voteOpen ?
					<div className="rate-vote-container">
						<RaisedButton
							className="button"
							label="Like"
							labelPosition="after"
							icon={<ThumbUp />}
							onClick={this.like}
							secondary
						/>
						<RaisedButton
							className="button"
							label="Dislike"
							labelPosition="before"
							icon={<ThumbDown />}
							onClick={this.dislike}
							primary
						/>
					</div>
					: null}
			</Layout>
		);
	}
}

export default Rate;
