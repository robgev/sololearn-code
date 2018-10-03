import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { ListItem } from 'material-ui/List';

@translate(null, { withRef: true })
class ChallengeItem extends Component {
	static getTypeString = (type) => {
		switch (type) {
		case 1:
			return 'factory.quiz-type-multiple-choice';
		case 2:
			return 'factory.quiz-type-guess-the-output';
		case 3:
			return 'factory.quiz-type-fill-in-the-blanks';
		default:
			throw new Error('Can\'t identify type of submitted challenge');
		}
	};

	static getStatus = (status) => {
		switch (status) {
		case 1:
			return { text: 'factory.submission-pending', color: '#BDBDBD' };
		case 2:
			return { text: 'factory.submission-declined', color: '#D32F2F' };
		case 3:
			return { text: 'factory.submission-approved', color: '#9CCC65' };
		default:
			throw new Error('Can\'t identify status of submitted challenge');
		}
	}

	static getQuestionTitle = (question) => {
		const indexOfFormat = question.indexOf(question.match(/\[!\w+!]/));
		if (indexOfFormat === -1) {
			return question;
		}
		return question.substring(0, indexOfFormat);
	};

	state = { highlighted: false }

	scrollIntoView = () => {
		this.mainDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.setState({ highlighted: true }, () => {
			setTimeout(() => {
				this.setState({ highlighted: false });
			}, 2000);
		});
	}
	render() {
		const {
			t, quiz, preview, leftIcon,
		} = this.props;
		return (
			<div className={`challenge-item${this.state.highlighted ? ' animate' : ''}`} ref={(node) => { this.mainDiv = node; }}>
				<ListItem
					onClick={() => preview(quiz)}
					className="preview"
					leftIcon={leftIcon}
					rightIcon={
						<div
							className="status"
							style={{ height: 'initial', width: 80, backgroundColor: ChallengeItem.getStatus(quiz.status).color }}
						>
							{t(ChallengeItem.getStatus(quiz.status).text)}
						</div>
					}
					primaryText={
						<div className="primary-text">
							{ChallengeItem.getQuestionTitle(quiz.question)}
						</div>
					}
					key={quiz.id}
					secondaryText={t(ChallengeItem.getTypeString(quiz.type))}
				/>
			</div>
		);
	}
}

export default ChallengeItem;
