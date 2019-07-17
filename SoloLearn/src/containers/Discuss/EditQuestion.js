import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { editPostInList } from 'actions/discuss';
import Service from 'api/service';

import { Loading } from 'components/atoms';
import { BluredBackground } from 'components/molecules';

import QuestionEditor from './QuestionEditor';

@connect(null, { editPostInList })
class EditQuestion extends Component {
	submit = ({ title, message, tags }) => {
		const { id } = this.props.post;
		return Service.request('Discussion/EditPost', {
			id, message, title, tags,
		})
			.then(({ post }) => {
				this.props.post.title = post.title;
				this.props.post.message = post.message;
				this.props.post.tags = post.tags;
				this.props.editPostInList({
					id, title, message, tags,
				});
			})
			.then(() => {
				this.props.exitEditMode();
			});
	}

	render() {
		const { post } = this.props;
		return (
			<Fragment>
				{
					post === null ?
						<Loading />
						:
						<BluredBackground clickAwayAction={this.props.exitEditMode}>
							<QuestionEditor
								isNew={false}
								submit={this.submit}
								post={post}
								handleCancel={this.props.exitEditMode}
							/>
						</BluredBackground>
				}
			</Fragment>
		);
	}
}

export default EditQuestion;
