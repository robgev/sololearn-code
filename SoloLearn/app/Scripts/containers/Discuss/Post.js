// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';

// Material UI components
import { DropDownMenu, MenuItem, FlatButton } from 'material-ui';

// Redux modules
import { connect } from 'react-redux';
import {
	loadPostInternal, loadRepliesInternal, loadPreviousRepliesInternal,
	emptyReplies, votePostInternal, deletePostInternal, loadPost,
	addReply,
} from 'actions/discuss';
import { isLoaded } from 'reducers';

// Popups
import Popup from 'api/popupService';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
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
@Radium
class Post extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ordering: 1,
			isLoading: true,
			fullyLoaded: false,
			deletePopupOpened: false,
		};

		this.deletingPost = null;
	}

	async componentWillMount() {
		this.initialize();
	}

	async componentWillReceiveProps(newProps) {
		const { params: newParams } = newProps;
		const { params: oldParams } = this.props;
		if (newParams.id !== oldParams.id) {
			this.initialize();
		} else if (newParams.replyId != null && newParams.replyId !== oldParams.replyId) {
			this.props.emptyReplies();
			await this.getReplies(newParams.replyId);
			this._replies.scrollTo(newParams.replyId);
		}
	}

	componentWillUnmount() {
		this.props.loadPost(null);
	}

	initialize = async () => {
		const { params } = this.props;
		this.props.loadPost(null);
		await this.props.loadPostInternal(params.id);
		await this.getReplies(params.replyId);
		if (params.replyId) {
			this._replies.scrollTo(params.replyId);
		}
		this.checkAlias(params.questionName);
	}

	// Get post answers
	getReplies = async (replyId) => {
		const { ordering } = this.state;
		this.setState({ isLoading: true });
		await this.props.loadRepliesInternal(ordering, replyId);
		this.setState({ isLoading: false });
	}

	getPreviousReplies = async () => {
		const { ordering } = this.state;
		await this.props.loadPreviousRepliesInternal(ordering);
	}

	addReply = async (message) => {
		const id = await this.props.addReply(this.props.post.id, message, this.state.ordering === 1);
		this._replies.recompute(this.props.post.replies.findIndex(r => r.id === id));
		this._replies.scrollTo(id);
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
	handleFilterChange = (e, index, value) => {
		const { post } = this.props;
		browserHistory.replace(`/discuss/${post.id}/${post.alias}`);
		this.setState({ ordering: value });
		this.loadRepliesByState();
	}

	// Load questions when condition changes
	loadRepliesByState = async () => {
		try {
			this.props.emptyReplies();
			await this.getReplies();
		} catch (e) {
			console.log(e);
		}
	}

	votePost = (post, voteValue) => {
		this.props.votePostInternal(post, voteValue);
		this._replies._forceUpdate();
	}

	// Open deleting confimation dialog
	openDeletePopup = (post) => {
		this.deletingPost = post;
		this.setState({ deletePopupOpened: true });
	}

	// Close deleting confimation dialog
	closeDeletePopup = () => {
		const index = this.props.post.replies.findIndex(r => r.id === this.deletingPost.id) - 1;
		this.setState({ deletePopupOpened: false });
		this.deletingPost = null;
		this._replies.recompute(index);
	}

	remove = () => {
		const isPrimary = this.deletingPost.parentID == null;
		if (isPrimary) {
			browserHistory.push('/discuss/');
		}
		this.props.deletePostInternal(this.deletingPost);
		this.closeDeletePopup();
	}

	deleteActions = [
		{
			componentType: FlatButton,
			label: 'popupCancel',
			primary: false,
			actionCallback: this.closeDeletePopup,
		},
		{
			componentType: FlatButton,
			label: 'popupDelete',
			primary: false,
			actionCallback: this.remove,
		},
	];

	render() {
		const { post } = this.props;
		if (!this.props.isLoaded) {
			return <LoadingOverlay />;
		}
		const usersQuestion = post.userID === this.props.userId;
		return (
			<div style={styles.postWrapper}>
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
				<div style={styles.repliesWrapper}>
					{(this.state.isLoading && post.replies.length === 0) && <LoadingOverlay size={30} />}
					{
						this.props.isLoaded &&
						<Replies
							replies={post.replies}
							votePost={this.votePost}
							openDeletePopup={this.openDeletePopup}
							isUsersQuestion={usersQuestion}
							loadReplies={this.getReplies}
							loadPreviousReplies={this.getPreviousReplies}
							orderBy={this.state.ordering}
							ref={(replies) => { this._replies = replies; }}
						/>
					}
					{
						(post.replies.length > 0 && !this.state.fullyLoaded) &&
						<div
							style={!this.state.isLoading ?
								styles.bottomLoading.base :
								[ styles.bottomLoading.base, styles.bottomLoading.active ]}
						>
							<LoadingOverlay size={30} />
						</div>
					}
				</div>
				<AddReply save={this.addReply} />

				{
					this.state.deletePopupOpened &&
					Popup.getPopup(
						Popup.generatePopupActions(this.deleteActions),
						this.state.deletePopupOpened, this.closeDeletePopup, [ { key: 'postDeleteConfirmText', replacemant: '' } ],
					)
				}
			</div>
		);
	}
}

export default Post;
