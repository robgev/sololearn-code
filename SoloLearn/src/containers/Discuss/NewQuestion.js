import React, { Component } from 'react';
import Service from 'api/service';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { BluredBackground } from 'components/molecules';

import { emptyPosts } from 'actions/discuss';

import QuestionEditor from './QuestionEditor';

@connect(null, { emptyPosts })
class NewQuestion extends Component {
	submit = ({ title, message, tags }) => Service.request('Discussion/CreatePost', { title, message, tags })
		.then(({ post }) => {
			this.props.emptyPosts();
			browserHistory.push(`/discuss/${post.id}`);
		})

	render() {
		const { handleCancel } = this.props;
		return (
			<BluredBackground clickAwayAction={handleCancel}>
				<QuestionEditor
					isNew
					submit={this.submit}
					handleCancel={handleCancel}
				/>
			</BluredBackground>
		);
	}
}

export default NewQuestion;
