import React from 'react';
import PropTypes from 'prop-types';
import getCoordinates from 'textarea-caret';
import { getClosestAt, mentionTags } from './utils';
import './MentionInput.scss';

class Mention extends React.Component {
	state = {
		text: '',
		names: [],
		suggestor: {
			open: false,
			top: 0,
			left: 0,
			height: 0,
		},
	};
	tags = [];
	cursorPosition = null;
	handleChange = (e) => {
		if (this.tags.length >= 10) {
			return;
		}
		const { value, selectionStart } = e.target;
		const { top, left, height } = getCoordinates(
			e.target,
			e.target.selectionEnd,
		);
		this.cursorPosition = selectionStart;
		const closestAt = getClosestAt(value, selectionStart);
		if (closestAt !== null) {
			const partial = value.substring(closestAt + 1, selectionStart);
			this.props.getNames(partial).then((names) => {
				this.setState({
					suggestor: {
						open: true, top, left, height,
					},
					names: names.filter(name => !this.tags.some(tag => tag.name.slice(1) === name.name)),
				});
			});
		} else {
			this.setState(state => ({
				names: [],
				suggestor: { ...state.suggestor, open: false },
			}));
		}
		this.setState({
			text: value,
		});
	};
	select = (name) => {
		const { text } = this.state;
		const closestAt = getClosestAt(text, this.cursorPosition);
		this.setState(state => ({
			text:
				text.substr(0, closestAt + 1) +
				name.name +
				text.substr(this.cursorPosition),
			suggestor: { ...state.suggestor, open: false },
			names: [],
		}));
		this.tags.push({ name: `@${name.name}`, id: name.id });
	};
	submit = () => {
		const text = mentionTags(this.state.text, this.tags);
		this.props.submit(text);
	};
	render() {
		return (
			<div className="mention-container">
				<input onChange={this.handleChange} value={this.state.text} />
				<div
					className="suggestions"
					style={{
						display: this.state.suggestor.open ? 'flex' : 'none',
						top: this.state.suggestor.top + 30,
						left: this.state.suggestor.left,
					}}
				>
					{this.state.names.map(name => (
						<span
							role="button"
							tabIndex={0}
							className="item"
							onClick={() => this.select(name)}
							key={name.id}
						>
							{name.name}
						</span>
					))}
				</div>
			</div>
		);
	}
}

Mention.propTypes = {
	getNames: PropTypes.func.isRequired,
	submit: PropTypes.func.isRequired,
};

export default Mention;
