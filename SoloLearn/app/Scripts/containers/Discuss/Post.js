// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

// Redux modules
import { connect } from 'react-redux';
import {
	loadPostInternal,
	loadRepliesInternal,
	emptyReplies,
	votePostInternal,
	deletePostInternal,
	loadPost,
	addReply,
} from '../../actions/discuss';
import { isLoaded } from '../../reducers';

// Popups
import Popup from '../../api/popupService';

// Additional components
import Question from './Question';
import Replies from './Replies';
import AddReply from './AddReply';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

const styles = {
	postWrapper: {
		width: '1000px',
		margin: '20 auto',
	},

	repliesData: {
		padding: '5px 25px',
		overflow: 'hidden',
	},

	answersCount: {
		color: '#777',
		float: 'left',
		fontSize: '14px',
		lineHeight: '25px',
	},

	repliesFilterWrapper: {
		float: 'right',
	},

	filterLabel: {
		display: 'inline-block',
		verticalAlign: 'middle',
		padding: '0 0 0 15px',
		lineHeight: 'initial',
	},

	filterIcon: {
		position: 'initial',
		display: 'inline-block',
		verticalAlign: 'middle',
		padding: 0,
		width: 'auto',
		height: 'auto',
	},

	dropDownLabel: {
		display: 'inline-block',
		verticalAlign: 'middle',
		color: '#636262',
		fontSize: '14px',
	},

	repliesFilter: {
		display: 'inline-block',
		verticalAlign: 'middle',
		height: '25px',
	},

	repliesWrapper: {
		position: 'relative',
		width: 'inherit',
		margin: '0 0 153px 0',
		transition: 'margin 0.5s',
	},

	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},

		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},
};

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
		const { params } = this.props;
		await this.props.loadPostInternal(params.id);
		await this.getReplies(params.replyId);
		this.checkAlias(params.questionName);
	}

	// Add event listeners after component mounts
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		this.props.loadPost(null);
		window.removeEventListener('scroll', this.handleScroll);
	}

	// Get post answers
	getReplies = async (replyId) => {
		const { ordering } = this.state;
		await this.props.loadRepliesInternal(ordering, replyId);
		this.setState({ isLoading: false });
	}

	addReply = (message) => {
		this.props.addReply(this.props.post.id, message);
	}

	// Check alias of post
	checkAlias = (alias) => {
		const { post } = this.props;
		if (alias !== post.alias) {
			browserHistory.replace(`/discuss/${post.id}/${post.alias}`);
		}
	}
	// Check scroll state
	handleScroll = () => {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.getReplies();
			}
		}
	}

	// Change ordering of replies
	handleFilterChange = (e, index, value) => {
		this.setState({ ordering: value });
		this.loadRepliesByState();
	}

	// Load questions when condition changes
	loadRepliesByState = async () => {
		try {
			await this.props.emptyReplies();
			this.getReplies();
		} catch (e) {
			console.log(e);
		}
	}

	votePost = (post, voteValue) => {
		this.props.votePostInternal(post, voteValue);
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
				<div style={styles.repliesWrapper}>
					<Paper>
						{(this.state.isLoading && post.replies.length === 0) && <LoadingOverlay size={30} />}
						<Replies
							replies={post.replies}
							votePost={this.votePost}
							openDeletePopup={this.openDeletePopup}
							isUsersQuestion={usersQuestion}
						/>
					</Paper>
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

				{this.state.deletePopupOpened &&
					Popup.getPopup(
						Popup.generatePopupActions(this.deleteActions),
						this.state.deletePopupOpened, this.closeDeletePopup, [ { key: 'postDeleteConfirmText', replacemant: '' } ],
					)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'discussPost'),
	post: state.discussPost,
	userId: state.userProfile.id,
});

const mapDispatchToProps = {
	loadPostInternal,
	loadRepliesInternal,
	deletePostInternal,
	emptyReplies,
	votePostInternal,
	loadPost,
	addReply,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Post));
