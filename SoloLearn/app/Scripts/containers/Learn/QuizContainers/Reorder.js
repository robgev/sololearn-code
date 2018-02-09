// React modules
import React, { Component } from 'react';

// Material UI components
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const styles = {
	list: {
		listStyle: 'none',
		border: '1px solid #dedede',
		width: '400px',
		margin: '0 auto',
	},

	listItem: {
		listStyle: 'none',
		borderBottom: '1px solid #efefef',
		padding: '20px',
	},
};

const SortableItem = SortableElement(({ value }) => <li style={styles.listItem}>{value}</li>);

const SortableList = SortableContainer(({ items }) => (
	<ul style={styles.list}>
		{items.map((answer, i) =>
			(<SortableItem
				key={answer.id}
				index={i}
				id={answer.id}
				value={answer.text}
			/>))}
	</ul>
));

export default class Reorder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			correctOrderedAnswers: [],
			answers: [],
		};

		this.unlock = this.unlock.bind(this);
		this.check = this.check.bind(this);
	}

	shuffle(array) {
		for (let i = array.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[ array[i - 1], array[j] ] = [ array[j], array[i - 1] ];
		}

		return array;
	}

    onSortEnd = ({ oldIndex, newIndex }) => {
    	const { answers } = this.state;

    	this.setState({
    		answers: arrayMove(answers, oldIndex, newIndex),
    	});
    };

    unlock() {
    	this.setState({
    		answers: this.state.correctOrderedAnswers,
    	});
    }

    check() {
    	const { answers } = this.state;
    	const { correctOrderedAnswers } = this.state;

    	for (let i = 0; i < answers.length; i++) {
    		if (answers[i].id != correctOrderedAnswers[i].id) {
    			return false;
    		}
    	}

    	return true;
    }

    render() {
    	const { answers } = this.state;

    	return (
    		<div className="reorder">
    			<SortableList items={answers} onSortEnd={this.onSortEnd} lockAxis="y" />
 </div>
    	);
    }

    componentWillMount() {
    	const answers = this.props.quiz.answers;
    	const shuffledAnswers = this.shuffle(answers.slice()); // MUST CHECK
		const { isShowingCorrectAnswers } = this.props;
		if (isShowingCorrectAnswers) {
			this.unlock();
		} else {
			this.setState({
				correctOrderedAnswers: answers,
				answers: shuffledAnswers,
			});
		}
    }
}
