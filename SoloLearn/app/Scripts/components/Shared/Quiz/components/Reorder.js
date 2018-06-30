import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffleArray } from 'utils';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { List, ListItem, RaisedButton } from 'material-ui';
import { quizType } from './types';

import TopBar from './TopBar';
import CheckIndicator from './CheckIndicator';
import QuestionContainer from './ConditionalPaper';

// Utility components

const SortableItem = SortableElement(({ value }) => <ListItem>{value}</ListItem>);

const SortableList = SortableContainer(({ items }) => (
	<List>
		{items.map((answer, i) =>
			(<SortableItem
				key={answer.id}
				index={i}
				id={answer.id}
				value={answer.text}
			/>))}
	</List>
));

class Reorder extends Component {
	state = {
		shuffled: this.getShuffled(this.props.quiz.answers),
		checkResult: null,
	}
	tryAgain = () => {
		this.props.onTryAgain();
		this.setState({
			shuffled: this.getShuffled(this.props.quiz.answers),
			checkResult: null,
		});
	}
	getShuffled = (answers) => {
		const shuffled = shuffleArray(answers);
		if (shuffled.some((el, i) => el.id !== answers[i].id)) {
			return shuffled;
		}
		return this.getShuffled(answers);
	}
	onSortEnd = ({ oldIndex, newIndex }) => {
		this.setState(state => ({
			answers: arrayMove(state.answers, oldIndex, newIndex),
		}));
	};
	unlock = () => {
		this.setState({ shuffled: this.props.quiz.answers });
		this.check();
	}
	check = () => {
		this.setState(
			state =>
				({ checkResult: !state.shuffled.some((el, i) => el.id !== this.props.quiz.answers[i].id) }),
			() => { this.props.onCheck(this.state.checkResult); },
		);
	}
	render() {
		const { shuffled, checkResult } = this.state;
		const {
			canTryAgain, isPaper, resButtonLabel, resButtonClick, resButtonDisabled,
		} = this.props;
		const isChecked = checkResult !== null;
		return (
			<div className="quiz">
				{this.props.unlockable &&
					<TopBar isPaper={isPaper} disabled={isChecked} onUnlock={this.props.onUnlock} />}
				<QuestionContainer isPaper={isPaper} className="question-container">
					<p className="question-text">{this.props.quiz.question}</p>
					<SortableList items={shuffled} onSortEnd={this.onSortEnd} lockAxis="y" />
				</QuestionContainer>
				<div className="check-container">
					<RaisedButton
						secondary
						onClick={!isChecked
							? this.check
							: resButtonClick !== null
								? resButtonClick
								: this.tryAgain}
						disabled={resButtonDisabled !== null
							? resButtonDisabled || !this.isComplete()
							: (!this.isComplete() || (isChecked && !canTryAgain))}
						label={!isChecked
							? 'Check'
							: resButtonLabel !== null
								? resButtonLabel
								: 'Try again'}
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

Reorder.defaultProps = {
	onCheck: () => { },
	onUnlock: () => { },
};

Reorder.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
	onCheck: PropTypes.func, // handles side effects after checking
	onUnlock: PropTypes.func, // returns true if can unlock and handles side effects
	canTryAgain: PropTypes.bool.isRequired,
	onTryAgain: PropTypes.func.isRequired,
	resButtonLabel: PropTypes.string, // eslint-disable-line react/require-default-props
	resButtonClick: PropTypes.func, // eslint-disable-line react/require-default-props
	resButtonDisabled: PropTypes.bool, // eslint-disable-line react/require-default-props
};

export default Reorder;
