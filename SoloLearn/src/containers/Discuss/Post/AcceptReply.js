import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { IconButton } from 'components/atoms';
import { Accepted } from 'components/icons';
import { determineAccessLevel } from 'utils';

const mapStateToProps = (state, ownProps) => ({
	canAcceptReply: determineAccessLevel(state.userProfile.accessLevel) > 2,
	isMyQuestion: state.userProfile.id === ownProps.askerID,
});

@connect(mapStateToProps)
class Options extends Component {
	handleClose = () => {
		this.setState({ anchorEl: null });
	}
	handleClick = (e) => {
		this.setState({ anchorEl: e.currentTarget });
	}
	render() {
		const {
			isMyQuestion, canAcceptReply, onClick, isAccepted
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
