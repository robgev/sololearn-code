import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import Quiz, { CheckIndicator } from 'components/Shared/Quiz';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import { getReviewChallenge, voteChallenge } from './api';
import './rateStyles.scss';

class Rate extends Component {
	state = {
		challenge: null,
		voteOpen: false,
		isQuizComplete: false,
		checkResult: null,
	}
	componentWillMount() {
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
		this.closeChallenge();
		const { courseId } = this.props.params;
		const challenge = await getReviewChallenge(courseId);
		this.setState({ challenge });
	}
	closeChallenge = () => {
		this.setState({
			voteOpen: false, challenge: null, isQuizComplete: false, checkResult: null,
		});
	}
	tryAgain = () => {
		this.setState({ voteOpen: false });
	}
	letVote = () => {
		this.setState({ voteOpen: true });
	}
	onChange = ({ isComplete }) => {
		this.setState({ isQuizComplete: isComplete });
	}
	check = () => {
		this.setState({ checkResult: this.quiz.check() });
		this.letVote();
	}
	tryAgain = () => {
		this.quiz.tryAgain();
		this.setState({ checkResult: null, isQuizComplete: false, voteOpen: false });
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
			challenge, voteOpen, checkResult, isQuizComplete,
		} = this.state;
		return (
			<Layout className="rate-container">
				<div className="challenge-container">
					<Paper className="stretch">
						{
							challenge !== null ?
								<Quiz
									quiz={challenge}
									onChange={this.onChange}
									disabled={checkResult !== null}
									ref={(q) => { this.quiz = q; }}
								/> : <LoadingOverlay />
						}
					</Paper>
					{challenge !== null ? (
						<div className="check-container">
							<div>
								<FlatButton
									className="check-container-button"
									label="Skip"
									onClick={this.getChallenge}
									primary
								/>
								<RaisedButton
									className="check-container-button"
									label={this.checkBarLabel}
									onClick={this.checkBarOnClick}
									secondary
									disabled={!isQuizComplete}
								/>
							</div>
							<CheckIndicator status={checkResult} />
						</div>
					) : null}
				</div>
				{voteOpen ?
					<div className="vote-container">
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
					</div> : null
				}
			</Layout>
		);
	}
}

export default Rate;
