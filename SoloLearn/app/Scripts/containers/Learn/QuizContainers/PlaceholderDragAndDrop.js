// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import ReactDOM from 'react-dom';

// Additional components
import PlaceholderBase from './PlaceholderBase';
import PlaceholderControl from './PlaceholderControl';

// Utils
import Dragula from 'react-dragula';

const dragulaMirror = (<Style
	scopeSelector=".gu-mirror"
	rules={{
		position: 'fixed !important',
		margin: '0 !important',
		zIndex: '9999 !important',
		opacity: '0.8',
		// -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
		filter: 'alpha(opacity=80)',
	}}
/>);

const dragulaHide = (<Style
	scopeSelector=".gu-hide"
	rules={{
		display: 'none !important;',
	}}
/>);

const dragulaUnselectable = (<Style
	scopeSelector=".gu-unselectable"
	rules={{
		// -webkit-user-select: none !important;
		// -moz-user-select: none !important;
		// -ms-user-select: none !important;
		userSelect: 'none !important',
	}}
/>);

const dragulaTransit = (<Style
	scopeSelector=".gu-transit"
	rules={{
		opacity: '0.2',
		// -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
		filter: 'alpha(opacity=20)',
	}}
/>);

const styles = {
	wrapper: {
		width: '500px',
		textAlign: 'left',
		fontSize: '20px',
		margin: 'auto',
	},

	topStyle: {
		overflow: 'hidden',
	},

	bag: {
		overflow: 'hidden',
		width: '500px',
		height: '50px',
		margin: '15px 0 0 0',
		boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
	},

	answer: {
		base: {
			float: 'inlien-block',
			margin: '0 10px',
			transition: 'all 0.3s ease-in-out',
		},

		absolute: {
			position: 'absolute',
		},
	},
};

class PlaceholderDragAndDrop extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isChecked: false,
			unlocked: false,
		};

		this.unlock = this.unlock.bind(this);
	}

	generateAnswers() {
		return this.props.quiz.answers.map((answer, index) => (
			<div className="answer" key={index} data-id={answer.id} ref={`answer${answer.id}`} style={this.state.unlocked ? [ styles.answer.base, styles.answer.absolute ] : styles.answer.base}>{answer.text}</div>
		));
	}

	check() {
		this.setState({
			isChecked: true,
		});

		return this._child.check();
	}

	offset(element) {
		let rect = element.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
	}

	setAnswerPositions() {
		const answers = this.props.quiz.answers;

		for (let i = 0; i < answers.length; i++) {
			const answer = answers[i];
			const answerDOMElement = ReactDOM.findDOMNode(this.refs[`answer${answer.id}`]);
			const answerPostions = this.offset(answerDOMElement);
			answerDOMElement.style.top = answerPostions.top;
			answerDOMElement.style.left = answerPostions.left;
		}

		this.setState({ unlocked: true });
	}

	move(placeholder, answer) {
		const placeholderPositions = this.offset(placeholder);

		answer.style.top = placeholderPositions.top;
		answer.style.left = placeholderPositions.left;

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 300);
		});
	}

	moved(placeholder, answer) {
		placeholder.appendChild(answer);

		answer.style.top = null;
		answer.style.left = null;
	}

	unlock() {
		this.setAnswerPositions();

		const correctAnswers = this.props.quiz.answers.filter(quiz => quiz.isCorrect);
		const child = this._child;

		for (let i = 0; i < correctAnswers.length; i++) {
			const answer = correctAnswers[i];
			const answerDOMElement = ReactDOM.findDOMNode(this.refs[`answer${answer.id}`]);

			const index = child.placeholderIndexes[i].index;
			const placeholder = ReactDOM.findDOMNode(child[`_child${index}`].refs[`placeholder${index}`]);

			this.move(placeholder, answerDOMElement).then(() => {
				this.moved(placeholder, answerDOMElement);
			});
		}

		setTimeout(() => {
			this.setState({ unlocked: false });
		}, 300);
	}

	render() {
		return (
			<div className="placeholder-dnd" style={styles.wrapper}>
				{dragulaMirror}
				{dragulaHide}
				{dragulaUnselectable}
				{dragulaTransit}
				<div id="top" style={styles.topStyle}>
					<PlaceholderBase quiz={this.props.quiz} quizComponent={PlaceholderControl} ref={(child) => { this._child = child; }} />
				</div>
				<div id="bottom" style={styles.bag} ref="bottom">{this.generateAnswers()}</div>
			</div>
		);
	}

	componentDidMount() {
		const refs = [];
		const child = this._child;
		for (let i = 0; i < child.placeholderIndexes.length; i++) {
			const index = child.placeholderIndexes[i].index;
			refs.push(child[`_child${index}`].refs[`placeholder${index}`]);
		}
		refs.push(this.refs.bottom);

		const bag = ReactDOM.findDOMNode(this.refs.bottom);

		const options = { };
		const drake = Dragula(refs, options);

		drake.on('drop', (el, target, source, sibling) => {
			if ((` ${target.id} `).indexOf(' ' + 'bottom' + ' ') > -1) {
				el.className = 'answer';
				return;
			}

			const targetNodes = target.getElementsByClassName('answer');
			const className = 'dropped';

			if (targetNodes.length > 1) {
				for (let i = 0; i < targetNodes.length; i++) {
					if ((` ${targetNodes[i].className} `).indexOf(` ${className} `) > -1) {
						targetNodes[i].className = 'answer';
						bag.appendChild(targetNodes[i]);
					} else {
						targetNodes[i].className += ` ${className}`;
					}
				}
			} else {
				el.className += ` ${className}`;
			}
		});
	}
}

export default Radium(PlaceholderDragAndDrop);
