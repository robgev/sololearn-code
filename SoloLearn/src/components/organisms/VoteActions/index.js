import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observable, action } from 'mobx';
import { vote } from 'actions/vote';
import { Snackbar } from 'components/atoms';
import getFaultReason from 'utils/faultGenerator';
import SignInPopup from 'components/SignInPopup';
import ILikes from './ILikes';
import VoteButtons from './VoteButtons';
import LikesPopup from './LikesPopup';
import './styles.scss';

const mapDispatchToProps = { vote };

const mapStateToProps = state => ({
	isLoggedIn: !!state.userProfile,
});

@connect(mapStateToProps, mapDispatchToProps)
@translate()
@observer
class VoteActions extends Component {
	@observable likes = new ILikes({
		type: this.props.type,
		id: this.props.id,
		userVote: this.props.initialVote,
		voteCount: this.props.initialCount,
	});

	@observable open = false;
	@observable isSnackbarOpen = false;

	@action closeSnackbar = () => {
		this.isSnackbarOpen = false;
	}

	@action openSnackbar = () => {
		this.isSnackbarOpen = true;
	}

	@action toggleOpen = () => {
		this.open = !this.open;
		if (this.open) {
			this.likes.empty();
		}
	}

	catchError = (e) => {
		if (e.data && getFaultReason(e.data).includes('NotActivated')) {
			this.showError();
		}
	}

	showError = () => {
		this.openSnackbar();
	}

	onUpvote = () => {
		const {
			type, id, vote, isLoggedIn, toggleSigninPopup,
		} = this.props;

		if (!isLoggedIn) {
			toggleSigninPopup();
		} else {
			this.likes.vote({ newVote: 1 })
				.then(() => {
					this.props.onChange({ vote: this.likes.userVote, votes: this.likes.voteCount });
					vote({
						type, id, vote: this.likes.userVote, votes: this.likes.voteCount,
					});
				})
				.catch(this.catchError);
		}
	}

	onDownvote = () => {
		const {
			type, id, vote, isLoggedIn, toggleSigninPopup,
		} = this.props;

		if (!isLoggedIn) {
			toggleSigninPopup();
		} else {
			this.likes.vote({ newVote: -1 })
				.then(() => {
					this.props.onChange({ vote: this.likes.userVote, votes: this.likes.voteCount });
					vote({
						type, id, vote: this.likes.userVote, votes: this.likes.voteCount,
					});
				})
				.catch(this.catchError);
		}
	}

	render() {
		const {
			t, vertical, className, small,
		} = this.props;
		return (
			<Fragment>
				<VoteButtons
					small={small}
					vertical={vertical}
					likes={this.likes}
					className={className}
					onUpvote={this.onUpvote}
					onDownvote={this.onDownvote}
					onLabelClick={this.toggleOpen}
				/>
				<LikesPopup open={this.open} likes={this.likes} onClose={this.toggleOpen} />
				<Snackbar
					onClose={this.closeSnackbar}
					open={this.isSnackbarOpen}
					message={t('votes.not-activated-account')}
				/>
			</Fragment>
		);
	}
}

VoteActions.defaultProps = {
	vertical: false,
	onChange: () => { },
	small: false,
};

VoteActions.propTypes = {
	small: PropTypes.bool,
	id: PropTypes.number.isRequired,
	type: PropTypes
		.oneOf([ 'code', 'post', 'userPost', 'lessonComment', 'userLessonComment', 'codeComment' ]).isRequired,
	vertical: PropTypes.bool,
	onChange: PropTypes.func,
	initialCount: PropTypes.number.isRequired,
	initialVote: PropTypes.oneOf([ 1, 0, -1 ]).isRequired,
};

export default VoteActions;
