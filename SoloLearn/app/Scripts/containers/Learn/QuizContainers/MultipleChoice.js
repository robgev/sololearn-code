// React modules
import React, { Component } from 'react';

// Material UI components
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

export const styles = {
	wrapper: {
		width: '600px',
		margin: '0 auto',
		zIndex: '1000',
		overflow: 'hidden',
	},

	radioButtonGroup: {
		width: 'inherit',
	},

	radioButton: {
		base: {
			padding: '15px',
			transition: 'box-shadow ease-in 100ms',
			borderBottom: '1px solid #eee',
		},

		elevated: {
			boxShadow: '0 4px 4px rgba(0,0,0,.16), 0 4px 4px rgba(0,0,0,.23)',
			zIndex: '1001',
		},
	},

	checkBoxGroup: {
		padding: 0,
	},

	checkBox: {
		borderBottom: '1px solid #eee',
	},
};

export default class MultipleChoice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			answers: [],
			selectedAnswerId: null,
		};

		this.correctAnswersCount = this.props.quiz.answers.filter(item => item.isCorrect).length;

		this.isSingleChoice = this.correctAnswersCount === 1;
	}

	componentWillMount() {
		this.setState({
			answers: this.getModifiedAnswers(this.props.quiz),
		});
	}
	getModifiedAnswers = (quiz) => {
		const { answers } = quiz;

		for (let i = 0; i < answers.length; i++) {
			// const answer = answers[i];
			answers[i].isSelected = false;
		}

		return this.shuffle(answers); // this.props.quiz.answers
	}

	shuffle = (array) => {
		for (let i = array.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[
				array[i - 1],
				array[j],
			] = [
				array[j],
				array[i - 1],
			];
		}

		return array;
	}

	handleCheckBoxSelection = (event, isChecked, index) => {
		const updatedAnswers = this.state.answers;
		updatedAnswers[index].isSelected = isChecked;

		this.setState({ answers: updatedAnswers });
	}

	handleRadioButtonSelection = (event, answerId) => {
		this.setState({ selectedAnswerId: answerId });

		const updatedAnswers = this.state.answers;

		for (let i = 0; i < updatedAnswers.length; i++) {
			const answer = updatedAnswers[i];
			answer.isSelected = answer.id === answerId;
		}

		this.setState({ answers: updatedAnswers });
	}

	renderList = (isSingleChoice) => {
		const { selectedAnswerId } = this.state;
		if (isSingleChoice) {
			return (
				<RadioButtonGroup
					name="singleChoice"
					style={styles.radioButtonGroup}
					valueSelected={this.state.selectedAnswerId}
					onChange={(event, value) => this.handleRadioButtonSelection(event, value)}
				>
					{
						this.state.answers.map(answer => (
							<RadioButton
								key={answer.id}
								value={answer.id}
								label={answer.text}
								style={{
									...styles.radioButton.base,
									...(selectedAnswerId === answer.id ? styles.radioButton.elevated : {}),
								}}
							/>
						))
					}
				</RadioButtonGroup>
			);
		}

		return (
			<List style={styles.checkBoxGroup}>
				{
					this.state.answers.map((answer, index) => (
						<ListItem
							key={answer.id}
							style={styles.checkBox}
							primaryText={answer.text}
							leftCheckbox={
								<Checkbox
									checked={answer.isSelected}
									onCheck={
										(event, isChecked) => this.handleCheckBoxSelection(event, isChecked, index)
									}
								/>
							}
						/>
					))
				}
			</List>
		);
	}

	unlock = () => {
		const { answers } = this.state;

		for (let i = 0; i < answers.length; i++) {
			const answer = answers[i];
			answer.isSelected = answer.isCorrect;

			if (this.isSingleChoice && answer.isCorrect) { this.setState({ selectedAnswerId: answer.id }); }
		}

		this.setState({ answers });
	}

	check = () => {
		const answers = this.state.answers;
		const selectedAnswers = answers.filter(item => item.isSelected);

		let isCorrect = false;

		if (selectedAnswers.length > 1) {
			let selectedAnswersCount = 0;
			let isWrong = false;
			for (let i = 0; i < selectedAnswers.length; i++) {
				if (selectedAnswers[i].isCorrect) {
					selectedAnswersCount++;
				} else {
					isWrong = true;
					break;
				}
			}
			if (!isWrong) {
				let correctAnswers = 0;
				for (let i = 0; i < answers.length; i++) {
					if (answers[i].isCorrect) { correctAnswers++; }
				}
				isCorrect = correctAnswers == selectedAnswersCount;
			}
		} else if (selectedAnswers.length == 1) {
			const answer = selectedAnswers[0];
			isCorrect = answer.isCorrect;
		}

		return isCorrect;
	}

	render() {
		return (
			<Paper
				className={this.isSingleChoice
					? 'singlechoice'
					: 'multiplechoice'}
				style={styles.wrapper}
			>
				{this.renderList(this.isSingleChoice)}
			</Paper>
		);
	}

	// componentWillReceiveProps(nextProps) {
	//    if(this.props.quiz.id == nextProps.quiz.id) {
	//        this.setState({
	//            answers: this.getModifiedAnswers(nextProps.quiz),
	//            selectedAnswerId: null
	//        });
	//    }
	// }
}
