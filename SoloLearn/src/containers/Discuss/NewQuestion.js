// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

import { showError } from 'utils';
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
			})
			.catch((e) => {
				if (e.data) {
					showError(e.data);
				} else {
					toast.error(`❌Something went wrong when trying to edit comment: ${e.message}`);
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
