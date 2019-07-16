import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { editPostInList } from 'actions/discuss';
import Service from 'api/service';

import { Loading } from 'components/atoms';

import QuestionEditor from './QuestionEditor';

@connect(null, { editPostInList })
class EditQuestion extends Component {
	submit = ({ title, message, tags }) => {
		const { id } = this.props.post;
		return Service.request('Discussion/EditPost', {
			id, message, title, tags,
		})
			.then(() => {
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
						<QuestionEditor
							isNew={false}
							submit={this.submit}
							post={post}
							handleCancel={this.props.exitEditMode}
						/>
				}
			</Fragment>
		);
	}
}

export default EditQuestion;
