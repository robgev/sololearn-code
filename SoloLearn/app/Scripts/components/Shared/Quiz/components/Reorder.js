import React, { Component } from 'react';
import { shuffleArray } from 'utils';
import { List, ListItem } from 'material-ui';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { answersType } from './types';

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
		shuffled: this.getShuffled(this.props.answers),
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
		this.setState({ shuffled: this.props.answers });
	}
	check = () => !this.state.shuffled.some((el, i) => el.id !== this.props.answers[i].id)
	render() {
		const { shuffled } = this.state;
		return (
			<SortableList items={shuffled} onSortEnd={this.onSortEnd} lockAxis="y" />
		);
	}
}

Reorder.propTypes = {
	answers: answersType.isRequired,
};

export default Reorder;
