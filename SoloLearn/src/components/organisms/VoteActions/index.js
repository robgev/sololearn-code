import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import ILikes from './ILikes';
import VoteButtons from './VoteButtons';
import LikesPopup from './LikesPopup';
import './styles.scss';

@observer
class VoteActions extends Component {
	@observable likes = new ILikes({
		type: this.props.type,
		id: this.props.id,
		userVote: this.props.initialVote,
		voteCount: this.props.initialCount,
	});

	@observable open = false;

	@action toggleOpen = () => {
		this.open = !this.open;
		if (!this.open) {
			this.likes.empty();
		}
	}

	onUpvote = () => {
		this.likes.vote({ newVote: 1 });
		this.props.onChange({ vote: this.likes.userVote, newVote: 1 });
	}

	onDownvote = () => {
		this.likes.vote({ newVote: -1 });
		this.props.onChange({ vote: this.likes.userVote, newVote: -1 });
	}

	render() {
		const { vertical } = this.props;
		return (
			<Fragment>
				<VoteButtons
					vertical={vertical}
					likes={this.likes}
					onUpvote={this.onUpvote}
					onDownvote={this.onDownvote}
					onLabelClick={this.toggleOpen}
				/>
				<LikesPopup open={this.open} likes={this.likes} onClose={this.toggleOpen} />
			</Fragment>
		);
	}
}

VoteActions.defaultProps = {
	vertical: false,
	onChange: () => { },
};

VoteActions.propTypes = {
	id: PropTypes.number.isRequired,
	type: PropTypes
		.oneOf([ 'code', 'post', 'lessonComment', 'userLessonComment', 'codeComment' ]).isRequired,
	vertical: PropTypes.bool,
	onChange: PropTypes.func,
	initialCount: PropTypes.number.isRequired,
	initialVote: PropTypes.oneOf([ 1, 0, -1 ]).isRequired,
};

export default VoteActions;
