import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { editPostInList } from 'actions/discuss';
import Service from 'api/service';

import { LayoutWithSidebar } from 'components/molecules';
import { Loading } from 'components/atoms';

import QuestionEditor from './QuestionEditor';
import GuideLinesSidebar from './GuideLinesSidebar';

@connect(null, { editPostInList })
class EditQuestion extends Component {
	state = {
		post: null,
	}

	componentDidMount() {
		this._isMounted = true;
		document.title = 'Create a new question';
		const { id } = this.props.params;
		Service.request('Discussion/GetPost', { id })
			.then(({ post }) => {
				if (this._isMounted) {
					this.setState({ post });
				}
			});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	submit = ({ title, message, tags }) => {
		const { id } = this.state.post;
		return Service.request('Discussion/EditPost', {
			id, message, title, tags,
		})
			.then(() => {
				this.props.editPostInList({
					id, title, message, tags,
				});
				if (this._isMounted) {
					browserHistory.replace(`/discuss/${id}`);
				}
			});
	}

	render() {
		const { post } = this.state;
		return (
			<LayoutWithSidebar
				sidebar={
					<GuideLinesSidebar />
				}
			>
				{
					post === null
						? <Loading />
						: <QuestionEditor isNew={false} submit={this.submit} post={post} />
				}
			</LayoutWithSidebar>
		);
	}
}

export default EditQuestion;
