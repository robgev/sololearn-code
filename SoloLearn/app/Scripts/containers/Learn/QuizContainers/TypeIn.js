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
	}

	check() {
		this.setState({
			isChecked: true,
		});

		return this._child.check();
	}

	render() {
		return (
			<div className="typeIn" style={styles.wrapper}>
				<TypeInControl
					singleTipeIn
					fontSize={42}
					answer={this.answer}
					isChecked={this.state.isChecked}
					ref={(child) => { this._child = child; }}
				/>
			</div>
		);
	}
}
