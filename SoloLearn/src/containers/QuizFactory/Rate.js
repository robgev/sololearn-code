import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { PaperContainer, Loading, FlexBox } from 'components/atoms';
import { FlatButton, RaisedButton, IconWithText } from 'components/molecules';
import { ThumbUp, ThumbDown } from 'components/icons';
import Quiz, { CheckIndicator } from 'components/Quiz';
import { showError } from 'utils';
import Layout from './Layout';
import { getReviewChallenge, voteChallenge } from './api';
import './rateStyles.scss';

@translate()
class Rate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			challenge: null,
			voteOpen: false,
			isQuizComplete: false,
			checkResult: null,
			isFetching: false,
		};
		document.title = 'Sololearn | Rate Quizes';
		this.preloaded = null;
	}
	componentWillMount() {
		this.getChallenge();
		this.preload();
	}
	like = () => {
		voteChallenge(this.state.challenge.id, 1)
			.catch((e) => {
				showError(e, 'Something went wrong when trying to vote');
			});
		this.getChallenge();
	}
	dislike = () => {
		voteChallenge(this.state.challenge.id, -1)
			.catch((e) => {
				showError(e, 'Something went wrong when trying to vote');
			});
		this.getChallenge();
	}
	getChallenge = async () => {
		this.closeChallenge();
		const { preloaded } = this;
		if (preloaded !== null) {
			this.preload();
			this.setState({ challenge: preloaded });
		} else {
			this.setState({ isFetching: true });
			const challenge = await getReviewChallenge(this.props.params.courseId);
			this.setState({ challenge, isFetching: false });
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
			challenge, voteOpen, checkResult, isQuizComplete, isFetching,
		} = this.state;
		const { t } = this.props;
		return (
			<Layout className="quiz_factory-rate">
				<FlexBox align column>
					<PaperContainer className="challenge-item">
						{
							challenge !== null
								? (
									<Quiz
										key={challenge.id}
										quiz={challenge}
										onChange={this.onChange}
										disabled={checkResult !== null}
										ref={(q) => { this.quiz = q; }}
									/>
								)
								: isFetching
									? <FlexBox className="loading-container" justify align><Loading /></FlexBox>
									: t('common.empty-list-message')
						}
					</PaperContainer>
					{challenge !== null ? (
						<FlexBox className="check">
							<FlexBox>
								<FlatButton
									className="check-container-button"
									onClick={this.getChallenge}
									color="primary"
								>
									{t('factory.skip-item-title')}
								</FlatButton>
								<RaisedButton
									className="check-container-button"
									onClick={this.checkBarOnClick}
									color="secondary"
									disabled={!isQuizComplete}
								>
									{this.checkBarLabel}
								</RaisedButton>
							</FlexBox>
							<CheckIndicator status={checkResult} />
						</FlexBox>
					) : null}
				</FlexBox>
				{voteOpen
					? (
						<FlexBox justify className="vote-container">
							<RaisedButton
								className="button"
								onClick={this.like}
								color="secondary"
							>
								<IconWithText
									Icon={ThumbUp}
									iconClassname="vote-icon"
								>
									{t('factory.button-like')}
								</IconWithText>
							</RaisedButton>
							<RaisedButton
								className="dislike"
								onClick={this.dislike}
							>
								<IconWithText
									Icon={ThumbDown}
									iconClassname="vote-icon"
								>
									{t('factory.button-dislike')}
								</IconWithText>
							</RaisedButton>
						</FlexBox>
					)
					: null
				}
			</Layout>
		);
	}
}

export default Rate;
