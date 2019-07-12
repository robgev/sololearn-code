import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { changePostRepliesCount, removePostFromList,getSidebarQuestions } from 'actions/discuss';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { LayoutWithSidebar, EmptyCard } from 'components/molecules';
import Replies from './Replies';
import Question from './Question';
import DiscussSidebar from '../QuestionsList/Sidebar';
import IPost from './IPost';

import './styles.scss';
import SignInPopup from '../../../components/SignInPopup';

const mapDispatchToProps = {
	changePostRepliesCount,
	removePostFromList,
	getSidebarQuestions,
};

const mapStateToProps = ({ userProfile }) => ({
	isLoggedIn: !!userProfile,
});

@connect(mapStateToProps, mapDispatchToProps)
@translate()
@observer
class Post extends Component {
state={
	openSigninPopup: false,
}

	static defaultProps = {
		replyID: null,
	}

	post = new IPost({ id: this.props.id })

	handleDelete = () => this.post.deletePost()
		.then(this.props.removePostFromList)
		.then(() => {
			const currentLocation = browserHistory.getCurrentLocation();

			currentLocation.search === ''
				? browserHistory.replace('/discuss')
				: browserHistory.goBack();
		})

	handlePostRepliesCountChange = (countChange) => {
		this.props.changePostRepliesCount({ id: this.post.id, countChange });
		this.post.changeCount(countChange);
	}

	toggleSigninPopup=() => {
		this.setState(({ openSigninPopup }) => ({ openSigninPopup: !openSigninPopup }));
	}

	componentDidMount() {
		this.post.getPost()
			.then((post) => {
				post &&				this.props.setRouteAlias(post.title);
			});
			this.props.getSidebarQuestions();
	}

	render() {
		const { id, replyID, isLoggedIn } = this.props;
		const { openSigninPopup } = this.state;
		return (
			<LayoutWithSidebar
				paper={false}
				sidebar={<DiscussSidebar />}
				className="discuss_post"
			>
				{
					this.post.error === null
						? (
							<Question
								isLoggedIn={isLoggedIn}
								post={this.post.data}
								onFollowClick={this.post.onFollow}
								onDelete={this.handleDelete}
								toggleSigninPopup={this.toggleSigninPopup}
							/>
						)
						: <EmptyCard paper />
				}
				{
					this.post.data !== null
					&& (
						<Replies
							key={replyID || 0}
							postID={id}
							askerID={this.post.data.userID}
							replyID={replyID}
							count={this.post.count}
							onCountChange={this.handlePostRepliesCountChange}
							toggleSigninPopup={this.toggleSigninPopup}
						/>
					)
				}
				<SignInPopup
					url={`/discuss/${id}`}
					open={openSigninPopup}
					onClose={this.toggleSigninPopup}
				/>
			</LayoutWithSidebar>
		);
	}
}

export default Post;
