import React, { Component } from 'react';
import DroppableField from './DroppableField';

export default
class Answers extends Component {
	constructor(props) {
		super(props);
		const regex = /\{(\d)}/;
		this.splitAnswerText = props.answerText.split(regex);
	}
	render() {
		const {
			selected, width, isDisabled, onClick, correctAnswers, onDrop,
		} = this.props;
		return this.splitAnswerText.map((el, idx) => {
			if (idx % 2 !== 0) {
				// Answer area
				return (
					<DroppableField
						key={idx}
						index={el}
						onClick={onClick}
						color={isDisabled
							? selected[el] && selected[el].text === correctAnswers[el].text
								? 'green'
								: 'red'
							: 'black'
						}
						onDrop={onDrop}
						isDisabled={isDisabled}
						width={width}
						value={selected[el]}
					/>
				);
			}
			// Actual text
			return (
				<span
					className="fill-in-item"
					style={{ whiteSpace: 'pre-wrap' }}
					key={idx}
				>
					{el}
				</span>
			);
		});
	}
}
