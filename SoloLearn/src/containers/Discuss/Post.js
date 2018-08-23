// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { toast } from 'react-toastify';
import Radium from 'radium';
// Material UI components
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// Redux modules
import {
	loadPostInternal, loadRepliesInternal, loadPreviousRepliesInternal,
	emptyReplies, votePostInternal, deletePostInternal, loadPost,
	addReply,
} from 'actions/discuss';
import { isLoaded } from 'reducers';
import { showError } from 'utils';

// Popups
import Popup from 'api/popupService';

// Additional components
import LoadingOverlay from 'components/LoadingOverlay';
import Layout from 'components/Layouts/GeneralLayout';
import Question from './Question';
import Replies from './Replies';
import AddReply from './AddReply';

import { PostStyles as styles } from './styles';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'discussPost'),
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
@Radium
class Post extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ordering: 1,
			deletePopupOpened: false,
		};

		this.deletingPost = null;
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
		} else if (newParams.replyId != null && newParams.replyId !== oldParams.replyId) {
			this.props.emptyReplies();
			await this.getReplies(newParams.replyId);
			this._replies.getWrappedInstance().scrollToId(newParams.replyId);
		}
	}

	componentWillUnmount() {
		this.props.loadPost(null);
	}

	initialize = async () => {
		try {
			const { params } = this.props;
			this.props.loadPost(null);
			await this.props.loadPostInternal(params.id);
			await this.getReplies(params.replyId);
			if (params.replyId) {
				this._replies.getWrappedInstance().scrollToId(params.replyId);
			}
			this.checkAlias(params.questionName);
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch post');
		}
	}

	// Get post answers
	getReplies = (replyId) => {
		try {
			const { ordering } = this.state;
			return this.props.loadRepliesInternal(ordering, replyId);
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
			this._replies.getWrappedInstance().scrollToId(id);
		} catch (e) {
			if (e.data) {
				showError(e.data);
			} else {
				toast.error(`❌Something went wrong when trying to add reply: ${e.message}`);
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

	remove = () => {
		const { deletingPost } = this;
		this.closeDeletePopup();
		const isPrimary = deletingPost.parentID == null;
		this.props.deletePostInternal(deletingPost)
			.catch((e) => {
				if (e.data) {
					showError(e.data);
				} else {
					toast.error(`❌Something went wrong when trying to delete post: ${e.message}`);
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
		if (!this.props.isLoaded) {
			return <LoadingOverlay />;
		}
		const usersQuestion = post.userID === this.props.userId;
		return (
			<Layout>
				<div>
					<Question question={post} votePost={this.votePost} remove={this.openDeletePopup} />
					<div style={styles.repliesData}>
						<p style={styles.answersCount}>{post.answers}{post.answers === 1 ? ' ANSWER' : ' ANSWERS'}</p>
						<div style={styles.repliesFilterWrapper}>
							<p style={styles.dropDownLabel}>Sort by:</p>
							<DropDownMenu
								style={styles.repliesFilter}
								iconStyle={styles.filterIcon}
								labelStyle={styles.filterLabel}
								underlineStyle={{ display: 'none' }}
								value={this.state.ordering}
								onChange={this.handleFilterChange}
								autoWidth={false}
							>
								<MenuItem value={1} primaryText="Votes" />
								<MenuItem value={2} primaryText="Date" />
							</DropDownMenu>
						</div>
					</div>
				</div>
				<AddReply save={this.addReply} postId={this.props.post.id} />
				<div
					style={styles.repliesWrapper}
					ref={(repliesWrapper) => { this.repliesWrapper = repliesWrapper; }}
				>
					{
						this.props.isLoaded &&
						<Replies
							key={this.state.ordering}
							t={t}
							replies={post.replies}
							votePost={this.votePost}
							scrollElement={this.repliesWrapper}
							openDeletePopup={this.openDeletePopup}
							isUsersQuestion={usersQuestion}
							loadReplies={this.getReplies}
							loadPreviousReplies={this.getPreviousReplies}
							orderBy={this.state.ordering}
							ref={(replies) => { this._replies = replies; }}
						/>
					}
				</div>
				<Dialog
					open={this.state.deletePopupOpened}
					actions={this.deleteActions}
				>
					{t('discuss.delete-question-message')}
				</Dialog>
				{
					this.state.deletePopupOpened &&
					Popup.getPopup(
						Popup.generatePopupActions(this.deleteActions),
						this.state.deletePopupOpened, this.closeDeletePopup, [ { key: 'postDeleteConfirmText', replacemant: '' } ],
					)
				}
			</Layout>
		);
	}
}

export default Post;
