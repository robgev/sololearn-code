import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { IconButton, Menu, MenuItem } from 'components/atoms';
import { MoreVert } from 'components/icons';
import { determineAccessLevel } from 'utils';

const mapStateToProps = (state, ownProps) => ({
	canRequestRemoval: determineAccessLevel(state.userProfile.accessLevel) > 2,
	isMe: state.userProfile.id === ownProps.userID,
});

@translate()
@connect(mapStateToProps)
class Options extends Component {
	state = {
		anchorEl: null,
	}
	handleClose = () => {
		this.setState({ anchorEl: null });
	}
	handleClick = (e) => {
		this.setState({ anchorEl: e.currentTarget });
	}
	render() {
		const {
			isMe, canRequestRemoval, t,
			editPost, deletePost, reportPost, removePost,
		} = this.props;
		const { anchorEl } = this.state;
		return (
			<Fragment>
				<IconButton
					onClick={this.handleClick}
				>
					<MoreVert />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					{isMe
						? (
							<MenuItem
								onClick={editPost}
							>
								{t('common.edit-action-title')}
							</MenuItem>
						)
						: null
					}
					{isMe
						? (
							<MenuItem
								onClick={deletePost}
							>
								{t('common.delete-title')}
							</MenuItem>
						)
						: null
					}
					{!isMe
						? (
							<MenuItem
								onClick={reportPost}
							>
								{t('common.report-action-title')}
							</MenuItem>
						)
						: null
					}
					{!isMe && canRequestRemoval
						? (
							<MenuItem
								onClick={removePost}
							>
								{t('common.remove-title')}
							</MenuItem>
						)
						: null
					}
				</Menu>
			</Fragment>
		);
	}
}

export default Options;
