// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { toast } from 'react-toastify';

import { connect } from 'react-redux';
import { editQuestion, loadPostInternal } from 'actions/discuss';
import { isLoaded, defaultsLoaded } from 'reducers';
import { showError } from 'utils';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';
import CircularProgress from 'material-ui/CircularProgress';

import QuestionEditor from './QuestionEditor';

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
	constructor(props) {
		super(props);
		this.state = { loading: !props.isLoaded };
		document.title = 'Create a new question';
		this._isUnmounted = false;
	}

	async componentWillMount() {
		const { params } = this.props;
		if (!this.props.isLoaded) {
			try {
				await this.props.loadPostInternal(params.id);
				if (!this._isUnmounted) {
					this.setState({ loading: false });
				}
			} catch (e) {
				if (e.data) {
					showError(e.data);
				} else {
					toast.error(`❌Something went wrong when trying to edit comment: ${e.message}`);
				}
			}
		}
	}

	componentWillUnmount() {
		this._isUnmounted = true;
	}

	submit = (title, description, tags) => {
		const { id: postId } = this.props.post;
		this.props.editQuestion(postId, title, description, tags)
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
		const { post } = this.props;
		const { loading } = this.state;
		return (
			<Layout>
				{
					loading
						? <CircularProgress style={{ display: 'flex', alignItems: 'center', margin: 'auto' }} />
						: <QuestionEditor submit={this.submit} post={post} />
				}
			</Layout>
		);
	}
}

export default NewQuestion;
