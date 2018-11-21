import React, { Component, Fragment, createRef } from 'react';
import { translate } from 'react-i18next';
import {
	ListItem, HorizontalDivider, FlexBox,
	Title, SecondaryTextBlock, Container,
} from 'components/atoms';
import { TagLabel } from 'components/molecules';

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
			return { text: 'factory.submission-pending', className: 'pending' };
		case 2:
			return { text: 'factory.submission-declined', className: 'declined' };
		case 3:
			return { text: 'factory.submission-approved', className: 'approved' };
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

	state = { isHighlighted: false }

	item = createRef();

	scrollIntoView = () => {
		this.item.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.setState({ isHighlighted: true }, () => {
			setTimeout(() => {
				this.setState({ isHighlighted: false });
			}, 2000);
		});
	}

	preview = () => {
		this.props.preview(this.props.quiz);
	}

	render() {
		const {
			t, languageCard, quiz,
		} = this.props;
		const { isHighlighted } = this.state;
		return (
			<Fragment>
				<ListItem>
					<FlexBox
						ref={this.item}
						justifyBetween
						className={`item ${isHighlighted ? 'animate-highlight' : ''}`}
						onClick={this.preview}
					>
						<FlexBox align className="info">
							<Container className="icon">
								{languageCard}
							</Container>
							<FlexBox className="name" column justify>
								<Title className="title">{ChallengeItem.getQuestionTitle(quiz.question)}</Title>
								<SecondaryTextBlock>{t(ChallengeItem.getTypeString(quiz.type))}</SecondaryTextBlock>
							</FlexBox>
						</FlexBox>
						<FlexBox align justify>
							<TagLabel className={`status ${ChallengeItem.getStatus(quiz.status).className}`}>
								{t(ChallengeItem.getStatus(quiz.status).text)}
							</TagLabel>
						</FlexBox>
					</FlexBox>
				</ListItem>
				<HorizontalDivider />
			</Fragment>
		);
	}
}

export default ChallengeItem;
