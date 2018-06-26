import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffleArray } from 'utils';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { List, ListItem, Paper, RaisedButton } from 'material-ui';
import { quizType } from './types';

import TopBar from './TopBar';
import CheckIndicator from './CheckIndicator';

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
		if (this.props.onUnlock()) {
			this.setState({ shuffled: this.props.quiz.answers });
			this.check();
		}
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
		const { canTryAgain } = this.props;
		const isChecked = checkResult !== null;
		return (
			<div className="quiz">
				{this.props.unlockable && <TopBar disabled={isChecked} onUnlock={this.unlock} />}
				<Paper className="question-container">
					<p className="question-text">{this.props.quiz.question}</p>
					<SortableList items={shuffled} onSortEnd={this.onSortEnd} lockAxis="y" />
				</Paper>
				<div className="check-container">
					<RaisedButton
						secondary
						onClick={isChecked ? this.tryAgain : this.check}
						disabled={isChecked && !canTryAgain}
						label={isChecked && canTryAgain ? 'Try again' : 'Check'}
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

Reorder.defaultProps = {
	onCheck: () => { },
	onUnlock: () => false,
};

Reorder.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
	onCheck: PropTypes.func, // handles side effects after checking
	onUnlock: PropTypes.func, // returns true if can unlock and handles side effects
	canTryAgain: PropTypes.bool.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default Reorder;
