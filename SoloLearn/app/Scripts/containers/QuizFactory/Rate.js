import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { red500 } from 'material-ui/styles/colors';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import Quiz, { CheckIndicator } from 'components/Shared/Quiz';
import { getReviewChallenge, voteChallenge } from './api';
import './rateStyles.scss';

class Rate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			challenge: null,
			voteOpen: false,
			isQuizComplete: false,
			checkResult: null,
		};
		document.title = 'Sololearn | Rate Quizes';
		this.preloaded = null;
	}
	componentWillMount() {
		this.getChallenge();
		this.preload();
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
		const { preloaded } = this;
		if (preloaded !== null) {
			this.preload();
			this.setState({ challenge: preloaded });
		} else {
			const challenge = await getReviewChallenge(this.props.params.courseId);
			this.setState({ challenge });
		}
	}
	preload = async () => {
		this.preloaded = null; // need to not repeat preloaded quizes
		this.preloaded = await getReviewChallenge(this.props.params.courseId);
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
					<Paper className="challenge">
						{
							challenge !== null ?
								<Quiz
									key={challenge.id} // need for remounting if preloaded
									quiz={challenge}
									onChange={this.onChange}
									disabled={checkResult !== null}
									ref={(q) => { this.quiz = q; }}
								/> : <CircularProgress size={40} style={{ display: 'flex' }} className="center-loading" />
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
							backgroundColor={red500}
							labelColor="#FFFFFF"
						/>
					</div> : null
				}
			</Layout>
		);
	}
}

export default Rate;
