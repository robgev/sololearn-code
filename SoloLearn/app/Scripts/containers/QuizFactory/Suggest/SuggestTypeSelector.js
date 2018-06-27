import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import { Dialog, FlatButton, RaisedButton } from 'material-ui';
import Quiz from 'components/Shared/Quiz';
import SuggestMultipleChoice from './SuggestMultipleChoice';
import SuggestTypeIn from './SuggestTypeIn';
import SuggestFillIn from './SuggestFillIn';
import { submitChallenge } from '../api';

import './style.scss';

class SuggestTypeSelector extends Component {
	state = {
		previewQuiz: null,
	}
	getSuggestComp = (type) => {
		const props = { setPreview: this.setPreview };
		switch (type) {
		case 'multiple-choice':
			return <SuggestMultipleChoice {...props} />;
		case 'type-in':
			return <SuggestTypeIn {...props} />;
		case 'fill-in':
			return <SuggestFillIn {...props} />;
		default:
			throw new Error('Unknown suggest quiz type');
		}
	}
	setPreview = (previewQuiz) => {
		this.setState({ previewQuiz });
	}
	closePreview = () => {
		this.setPreview(null);
	}
	handleSubmit = () => {
		const { previewQuiz } = this.state;
		const answers = previewQuiz.answers
			.map(({ text, properties, isCorrect }) => ({ text, properties, isCorrect }));
		const quiz = {
			...previewQuiz,
			answers,
		};
		submitChallenge(quiz);
	}
	render() {
		const { previewQuiz } = this.state;
		const actions = [
			<FlatButton onClick={this.closePreview} label="Cancel" primary />,
			<RaisedButton onClick={this.handleSubmit} label="Submit" primary />,
		];
		return (
			<Layout>
				{this.getSuggestComp(this.props.params.type)}
				<Dialog
					open={previewQuiz !== null}
					actions={actions}
					onRequestClose={this.closePreview}
				>
					{previewQuiz !== null ? <Quiz quiz={previewQuiz} canTryAgain /> : null}
				</Dialog>
			</Layout>
		);
	}
}

export default SuggestTypeSelector;
