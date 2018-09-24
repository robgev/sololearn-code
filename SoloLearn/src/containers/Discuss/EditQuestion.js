// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { editQuestion, loadPostInternal } from 'actions/discuss';
import { isLoaded, defaultsLoaded } from 'reducers';
import { showError } from 'utils';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';
import CircularProgress from 'material-ui/CircularProgress';

import QuestionEditor from './QuestionEditor';
import GuideLinesSidebar from './GuideLinesSidebar';

const mapStateToProps = state => ({
	defaultsLoaded: defaultsLoaded(state),
	isLoaded: isLoaded(state, 'discussPost'),
	post: state.discussPost,
});

const mapDispatchToProps = {
	loadPostInternal,
	editQuestion,
};

@connect(mapStateToProps, mapDispatchToProps)
class NewQuestion extends Component {
	async componentDidMount() {
		this._isMounted = true;
		document.title = 'Create a new question';
		const { params } = this.props;
		if (!this.props.isLoaded) {
			try {
				await this.props.loadPostInternal(params.id);
			} catch (e) {
				showError(e, 'Something went wrong when trying to fetch post');
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	submit = (title, description, tags) => {
		const { id: postId } = this.props.post;
		this.props.editQuestion(postId, title, description, tags)
			.then(({ id, alias }) => {
				if (this._isMounted) {
					browserHistory.push(`/discuss/${id}/${alias}`);
				}
			})
			.catch((e) => {
				showError(e, 'Something went wrong when trying to edit post');
			});
	}

	render() {
		const { post, isLoaded } = this.props;
		return (
			<Layout
				sidebarContent={
					<GuideLinesSidebar />
				}
			>
				{
					!isLoaded
						? <CircularProgress style={{ display: 'flex', alignItems: 'center', margin: 'auto' }} />
						: <QuestionEditor isNew={false} submit={this.submit} post={post} />
				}
			</Layout>
		);
	}
}

export default NewQuestion;
