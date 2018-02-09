// React modules
import React, { Component } from 'react';

// Additional components
import TypeInControl from './TypeInControl';
import PlaceholderBase from './PlaceholderBase';

const styles = {
	wrapper: {
		width: '500px',
		textAlign: 'left',
		margin: 'auto',
	},
};

export default class PlaceholderTypeIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isChecked: false,
		};
		this.isCorrect = false;
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
		// console.log(this.props);
		const { isShowingCorrectAnswers } = this.props;
		return (
			<div className="placeholder-typeIn" style={styles.wrapper}>
				<PlaceholderBase
					type={3}
					quiz={this.props.quiz}
					isChecked={this.state.isChecked}
					quizComponent={TypeInControl}
					isShowingCorrectAnswers={isShowingCorrectAnswers}
					ref={(child) => { this._child = child; }}
				/>
			</div>
		);
	}
}
