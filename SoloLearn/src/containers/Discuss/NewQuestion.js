import React, { Component } from 'react';
import Service from 'api/service';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { emptyPosts } from 'actions/discuss';

import { LayoutWithSidebar } from 'components/molecules';

import QuestionEditor from './QuestionEditor';
import GuideLinesSidebar from './GuideLinesSidebar';

@connect(null, { emptyPosts })
class NewQuestion extends Component {
	componentDidMount() {
		this._isMounted = true;
		document.title = 'Create a new question';
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	submit = ({ title, message, tags }) => Service.request('Discussion/CreatePost', { title, message, tags })
		.then(({ post }) => {
			this.props.emptyPosts();
			if (this._isMounted) {
				browserHistory.replace(`/discuss/${post.id}`);
			}
		})

	handleCancel = () => {
		browserHistory.push('/discuss');
	}

	render() {
		return (
			<LayoutWithSidebar
				sidebar={
					<GuideLinesSidebar />
				}
			>
				<QuestionEditor
					isNew
					submit={this.submit}
					handleCancel={this.handleCancel}
				/>
			</LayoutWithSidebar>
		);
	}
}

export default NewQuestion;
