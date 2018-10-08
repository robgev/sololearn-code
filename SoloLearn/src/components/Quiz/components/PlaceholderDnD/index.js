import React, { Component } from 'react';
import PlaceholderDND from './PlaceholderDnD';

// Needs to write to encapsulate getting DragAndDropContext ref
class PlaceholderWrapper extends Component {
	rawQuiz = React.createRef();
	get quiz() {
		return this.rawQuiz.current.getDecoratedComponentInstance();
	}
	unlock = () => {
		this.quiz.unlock();
	}
	hint = () => this.quiz.hint();
	tryAgain = () => {
		this.quiz.tryAgain();
	}
	check = () => this.quiz.check();
	render() {
		return <PlaceholderDND ref={this.rawQuiz} {...this.props} />;
	}
}

export default PlaceholderWrapper;
