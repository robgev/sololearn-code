import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IconButton } from 'components/atoms';
import { Accepted } from 'components/icons';
import { determineAccessLevel } from 'utils';

const mapStateToProps = (state, ownProps) => ({
	canAcceptReply: determineAccessLevel(state.userProfile.accessLevel) > 2,
	isMyQuestion: state.userProfile.id === ownProps.askerID,
});

@connect(mapStateToProps)
class Options extends Component {
	render() {
		const {
			isMyQuestion, canAcceptReply, onClick, isAccepted,
		} = this.props;
		return (
			isMyQuestion || canAcceptReply
				? (
					<IconButton
						className="accepted-icon"
						active={isAccepted}
						onClick={onClick}
					>
						<Accepted />
					</IconButton>
				)
				: isAccepted
					? (
						<IconButton
							disabled
							className="accepted-icon"
							active
						>
							<Accepted />
						</IconButton>
					)
					: null
		);
	}
}

export default Options;
