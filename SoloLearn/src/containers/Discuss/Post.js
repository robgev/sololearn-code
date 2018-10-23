// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { toast } from 'react-toastify';
// Material UI components
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'components/StyledDialog';
import FloatingButton from 'components/AddCodeButton/FloatingButton';

// Redux modules
import {
	loadPostInternal, loadRepliesInternal, loadPreviousRepliesInternal,
	emptyReplies, votePostInternal, deletePostInternal, loadPost,
	addReply,
} from 'actions/discuss';
import { showError } from 'utils';

// Additional components
import LoadingOverlay from 'components/LoadingOverlay';
import Layout from 'components/Layouts/GeneralLayout';
import Question from './Question';
import Replies from './Replies';
import AddReply from './AddReply';

import { PostStyles as styles } from './styles';

const mapStateToProps = state => ({
	// isLoaded: isLoaded(state, 'discussPost'),
	post: state.discussPost,
	userId: state.userProfile.id,
});

const mapDispatchToProps = {
	loadPostInternal,
	loadRepliesInternal,
	loadPreviousRepliesInternal,
	deletePostInternal,
	emptyReplies,
	votePostInternal,
	loadPost,
	addReply,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Post extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ordering: 1,
			deletePopupOpened: false,
		};

		this.deletingPost = null;
		this.inputRef = React.createRef();
	}

	async componentWillMount() {
		if (this.props.post === null || this.props.params.id !== this.props.post.id.toString()) {
			await this.initialize();
		}
		document.title = this.props.post ? this.props.post.title : 'SoloLearn';
		ReactGA.ga('send', 'screenView', { screenName: 'Discussion Thread Page' });
	}

	async componentWillReceiveProps(newProps) {
		const { params: newParams } = newProps;
		const { params: oldParams } = this.props;
		if (newParams.id !== oldParams.id) {
			this.initialize();
		}
	}

	initialize = async () => {
		try {
			const { params } = this.props;
			this.props.loadPost(null);
			await this.props.loadPostInternal(params.id);
			this.checkAlias(params.questionName);
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch post');
		}
	}

	// Get post answers
	getReplies = (replyId) => {
		try {
			const { ordering } = this.state;
			return this.props.loadRepliesInternal({
				postId: this.props.params.id,
				ordering,
				findPostId: replyId,
			});
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch replies');
		}
	}

	getPreviousReplies = async () => {
		try {
			const { ordering } = this.state;
			await this.props.loadPreviousRepliesInternal(ordering);
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch replies');
		}
	}

	addReply = async (message) => {
		try {
			const id = await this.props.addReply(this.props.post.id, message, this.state.ordering === 1);
			this._replies.getWrappedInstance().scrollToID(id);
		} catch (e) {
			if (e.data) {
				showError(e.data);
			} else {
				toast.error(`Something went wrong when trying to add reply: ${e.message}`);
			}
		}
	}

	// Check alias of post
	checkAlias = (alias) => {
		const { post } = this.props;
		if (alias !== post.alias) {
			const { replyId } = this.props.params;
			const answerId = replyId ? `/${replyId}` : '';
			browserHistory.replace(`/discuss/${post.id}/${post.alias}${answerId}`);
		}
	}

	// Change ordering of replies
	handleFilterChange = (_, __, value) => {
		if (value !== this.state.ordering) {
			const { post } = this.props;
			this.setState({ ordering: value });
			this.props.emptyReplies();
			browserHistory.replace(`/discuss/${post.id}/${post.alias}`);
		}
	}

	votePost = (post, voteValue) => {
		this.props.votePostInternal(post, voteValue)
			.catch(e => showError(e, 'Something went wrong when trying to vote post'));
	}

	// Open deleting confimation dialog
	openDeletePopup = (post) => {
		this.deletingPost = post;
		this.setState({ deletePopupOpened: true });
	}

	// Close deleting confimation dialog
	closeDeletePopup = () => {
		this.setState({ deletePopupOpened: false });
		this.deletingPost = null;
	}

	handleFabClick = (e) => {
		this.inputRef.current.editor.scrollIntoView({ block: 'center' });
		this.inputRef.current.mentionInput.forceFocus({ preventScroll: true });
	}

	remove = () => {
		const { deletingPost } = this;
		this.closeDeletePopup();
		const isPrimary = deletingPost.parentID == null;
		this.props.deletePostInternal(deletingPost)
			.catch((e) => {
				if (e.data) {
					showError(e.data);
				} else {
					toast.error(`Something went wrong when trying to delete post: ${e.message}`);
				}
			});
		if (isPrimary) {
			browserHistory.push({ pathname: '/discuss' });
		}
	}

	deleteActions = [
		<FlatButton
			onClick={this.closeDeletePopup}
			label={this.props.t('common.cancel-title')}
		/>,
		<FlatButton
			onClick={this.remove}
			label={this.props.t('common.delete-title')}
		/>,
	];

	render() {
		const { post, t } = this.props;
		if (post === null) {
			return <LoadingOverlay />;
		}
		const usersQuestion = post.userID === this.props.userId;
		return (
			<Layout>
				<div style={{ position: 'relative' }}>
					<Question question={post} votePost={this.votePost} remove={this.openDeletePopup} />
					<div style={styles.repliesData}>
						<p style={styles.answersCount}>
							{post.answers} {post.answers === 1 ? t('discuss.answer-one-format') : t('discuss.answer-other-format')}
						</p>
						<div style={styles.repliesFilterWrapper}>
							<p style={styles.dropDownLabel}>{t('discuss.answers.filter.title')}</p>
							<DropDownMenu
								style={styles.repliesFilter}
								iconStyle={styles.filterIcon}
								labelStyle={styles.filterLabel}
								underlineStyle={{ display: 'none' }}
								value={this.state.ordering}
								onChange={this.handleFilterChange}
							>
								<MenuItem value={1} primaryText={t('discuss.answers.filter.vote')} />
								<MenuItem value={2} primaryText={t('discuss.answers.filter.date')} />
							</DropDownMenu>
						</div>
					</div>
				</div>
				<AddReply t={t} ref={this.inputRef} save={this.addReply} postId={this.props.post.id} />
				<div
					style={styles.repliesWrapper}
					ref={(repliesWrapper) => { this.repliesWrapper = repliesWrapper; }}
				>
					<Replies
						key={this.state.ordering}
						ref={(node) => { this._replies = node; }}
						t={t}
						replies={post !== null ? post.replies : []}
						votePost={this.votePost}
						scrollElement={this.repliesWrapper}
						openDeletePopup={this.openDeletePopup}
						isUsersQuestion={usersQuestion}
						loadReplies={this.getReplies}
						loadPreviousReplies={this.getPreviousReplies}
						orderBy={this.state.ordering}
						selectedID={this.props.params.replyId || null}
					/>
					<div onMouseDown={this.handleFabClick}>
						<FloatingButton />
					</div>
				</div>
				<Dialog
					open={this.state.deletePopupOpened}
					actions={this.deleteActions}
					onRequestClose={this.closeDeletePopup}
				>
					{t('discuss.delete-question-message')}
				</Dialog>
			</Layout>
		);
	}
}

export default Post;
