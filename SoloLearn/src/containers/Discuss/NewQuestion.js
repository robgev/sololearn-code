// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { showError } from 'utils';
import { addQuestion, emptyPosts, getPosts } from 'actions/discuss';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';

import QuestionEditor from './QuestionEditor';

const mapDispatchToProps = { addQuestion, emptyPosts, getPosts };

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
				this.props.emptyPosts();
				this.props.getPosts();
				if (!this._isUnmounted) {
					browserHistory.push(`/discuss/${id}/${alias}`);
				}
			})
			.catch((e) => {
				showError(e.data, 'Something went wrong when trying to create question');
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
