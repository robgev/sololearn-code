// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { addQuestion } from 'actions/discuss';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';

import QuestionEditor from './QuestionEditor';

const mapDispatchToProps = { addQuestion };

@connect(null, mapDispatchToProps)
class NewQuestion extends Component {
	constructor() {
		super();
		document.title = 'Create a new question';
		this._isUnmounted = false;
	}

	componentWillUnmount() {
		this._isUnmounted = true;
	}

	submit = (title, description, tags) => {
		this.props.addQuestion(title, description, tags)
			.then(({ id, alias }) => {
				if (!this._isUnmounted) {
					browserHistory.push(`/discuss/${id}/${alias}`);
				}
			});
	}

	render() {
		return (
			<Layout>
				<QuestionEditor submit={this.submit} />
			</Layout>
		);
	}
}

export default NewQuestion;
