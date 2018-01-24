// React modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const styles = {
	textStyle: {
		verticalAlign: 'middle',
	},
};

const TextContent = props => (
	<span style={styles.textStyle} dangerouslySetInnerHTML={{ __html: props.content }} />
);

export default class PlaceholderBase extends Component {
	constructor(props) {
		super(props);

		this.isCorrect = false;
		this.placeholderItems = null;
		this.placeholderIndexes = [];
		this.quiz = this.props.quiz.answers;
		this.answers = this.props.quiz.answers;
		this.quizComponent = this.props.quizComponent;
	}

	rawTextContent(text) {
		const textContent = document.createElement('div');
		const parts = text.split('\r\n');
		for (let i = 0; i < parts.length; i++) {
			textContent.appendChild(document.createTextNode(parts[i].replace(/&nbsp;|\s/g, '\u00A0')));
			if (i < parts.length - 1) {
				const br = document.createElement('br');
				textContent.appendChild(br);
			}
		}

		const componentData = {
			componentType: TextContent,
			textComponent: true,
			props: {
				content: textContent.innerHTML,
			},
		};

		return componentData;
	}

	parse(quiz, answers) {
		let segmentContainer;

		const myRegexp = /\[!([a-zA-Z0-9]+)!\]((?:(?!\[![a-zA-Z0-9]+!\])[\s\S]*)*)/gi;
		let match = myRegexp.exec(quiz.question);

		while (match != null) {
			const format = match[1];

			segmentContainer = this.rawParser(match[2].trim(), answers);

			match = myRegexp.exec(quiz.question);
		}

		return segmentContainer;
	}

rawParser = function (rawText, answers) {
	const containers = [];

	const myRegexp = /\{(\d)\}/gi;
	let match = myRegexp.exec(rawText);
	let prevIndex = 0;
	while (match != null) {
		if (match.index > prevIndex) {
			containers.push(this.rawTextContent(rawText.substr(prevIndex, match.index - prevIndex)));
		}

		const index = parseInt(match[1]);

		const componentData = {
			componentType: this.quizComponent,
			textComponent: false,
			props: {
				answer: answers[index],
			},
		};

		containers.push(componentData);

		prevIndex = match.index + match[0].length;

		match = myRegexp.exec(rawText);
	}
	if (rawText.length > prevIndex) {
		containers.push(this.rawTextContent(rawText.substr(prevIndex)));
	}

	return containers;
}

generatePlaceholders() {
	this.placeholderItems = this.parse(this.props.quiz, this.props.quiz.answers);
	return this.placeholderItems.map((element, index) => {
		if (element.textComponent) {
			return (
				<element.componentType content={element.props.content} key={index} />
			);
		}

		this.placeholderIndexes.push({
			index,
			answerId: element.props.answer.id,
		});
		return (
			<element.componentType answer={element.props.answer} isChecked={this.props.isChecked} key={index} index={index} ref={(child) => { this[`_child${index}`] = child; }} />
		);
	});
}

hint() {
	let isCorrect = true;
	for (let i = 0; i < this.placeholderItems.length; i++) {
		const item = this.placeholderItems[i];
		if (!item.textComponent) {
			this[`_child${i}`].hint();
			isCorrect = isCorrect && this[`_child${i}`].isCorrect;
		}
	}
	this.isCorrect = isCorrect;
}

unlock() {
	for (let i = 0; i < this.placeholderItems.length; i++) {
		const item = this.placeholderItems[i];
		if (!item.textComponent) this[`_child${i}`].unlock();
	}
}

check() {
	for (let i = 0; i < this.placeholderItems.length; i++) {
		const item = this.placeholderItems[i];
		if (!item.textComponent) {
			if (!this[`_child${i}`].check()) return false;
		}
	}

	return true;
}

render() {
	return (
		<div className="textBlock">
			{this.generatePlaceholders()}
		</div>
	);
}
}
