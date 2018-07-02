import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffleArray } from 'utils';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { List, ListItem } from 'material-ui/List';
import quizType from './types';

// Utility components

const SortableItem = SortableElement(({ value }) => <ListItem>{value}</ListItem>);

const SortableList = SortableContainer(({ items, disabled }) => (
	<List>
		{items.map((answer, i) =>
			(<SortableItem
				key={answer.id}
				index={i}
				id={answer.id}
				value={answer.text}
				disabled={disabled}
			/>))}
	</List>
));

class Reorder extends Component {
	state = {
		shuffled: this.getShuffled(this.props.quiz.answers),
	}
	componentDidUpdate() {
		this.props.onChange({ isComplete: true }); // Reorder type quiz is always complete
	}
	tryAgain = () => {
		this.setState({
			shuffled: this.getShuffled(this.props.quiz.answers),
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
	}
	check = () => !this.state.shuffled.some((el, i) => el.id !== this.props.quiz.answers[i].id)
	render() {
		const { shuffled } = this.state;
		const { disabled } = this.props;
		return (
			<div className="question-container">
				<p className="question-text">{this.props.quiz.question}</p>
				<SortableList items={shuffled} disabled={disabled} onSortEnd={this.onSortEnd} lockAxis="y" />
			</div>
		);
	}
}

Reorder.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	// onChange: PropTypes.func.isRequired, * Reorder quiz is always complete *
};

export default Reorder;
