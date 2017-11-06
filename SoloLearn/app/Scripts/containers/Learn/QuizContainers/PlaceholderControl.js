// React modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const styles = {
	placeholder: {
		display: 'inline-block',
		verticalAlign: 'middle',
		minWidth: '50px',
		position: 'relative',
		height: '30px',
		margin: '0 4px',
		padding: '0 4px',
		textAlign: 'center',
	},

	underline: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: '3px',
		border: 'solid 2px #333',
		borderTop: 'none',
	},
};

export default class PlaceholderControl extends Component {
	constructor(props) {
		super(props);
	}

	unlock() {

	}

	check() {
		const placeholder = ReactDOM.findDOMNode(this.refs[`placeholder${this.props.index}`]);
		const answer = placeholder.querySelector('.answer');
		return parseInt(answer.getAttribute('data-id')) === this.props.answer.id;
	}

	render() {
		return (
			<div className="placeholder" ref={`placeholder${this.props.index}`} key={this.props.answer.id} style={styles.placeholder}>
				<div className="underline" style={styles.underline} />
			</div>
		);
	}
}
