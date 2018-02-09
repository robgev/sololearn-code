// React modules
import React, { Component } from 'react';

// Material UI Components
import TypeInControl from './TypeInControl';

const styles = {
	wrapper: {
		textAlign: 'center',
		fontSize: '42px',
	},
};

export default class TypeIn extends Component {
	constructor(props) {
		super(props);

		this.answer = this.props.quiz.answers[0];
		this.isCorrect = false;

		this.state = {
			isChecked: false,
		};

		this.unlock = this.unlock.bind(this);
		this.hint = this.hint.bind(this);
		this.check = this.check.bind(this);
	}

	unlock() {
		this._child.unlock();
	}

	hint() {
		this._child.hint();
		if (this._child.isCorrect) {
			this.isCorrect = true;
		}
	}

	check() {
		this.setState({
			isChecked: true,
		});

		return this._child.check();
	}

	render() {
		const { isShowingCorrectAnswers } = this.props;
		return (
			<div className="typeIn" style={styles.wrapper}>
				<TypeInControl
					singleTipeIn
					isShowingCorrectAnswers={isShowingCorrectAnswers}
					fontSize={42}
					answer={this.answer}
					isChecked={this.state.isChecked}
					ref={(child) => { this._child = child; }}
				/>
			</div>
		);
	}
}
