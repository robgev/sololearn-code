import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IconWithText } from 'components/molecules';
import { Accepted } from 'components/icons';
import { determineAccessLevel } from 'utils';

const mapStateToProps = (state, ownProps) => ({
	canAcceptReply: determineAccessLevel(state.userProfile.accessLevel) > 1,
	isMyQuestion: state.userProfile.id === ownProps.askerID,
});

@connect(mapStateToProps)
class Options extends Component {
	render() {
		const {
			isMyQuestion, canAcceptReply, onClick, isAccepted,
		} = this.props;
		return (
			!isAccepted && (isMyQuestion || canAcceptReply)
				? (
					<IconWithText
						Icon={Accepted}
						className="accepted-icon"
						active={isAccepted}
						onClick={onClick}
					>
						Mark as best
					</IconWithText>
				)
				: isAccepted
					? (
						<IconWithText
							Icon={Accepted}
							disabled
							className="accepted-icon best-answer"
							active
						>
							Best Answer
						</IconWithText>
					)
					: null
		);
	}
}

export default Options;
