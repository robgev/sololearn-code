import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu } from 'components/atoms';
import { MoreVert } from 'components/icons';
import './styles.scss';

class IconMenu extends Component {
	state = {
		anchorEl: null,
	};

	handleClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	onClick = () => {
		const { closeOnClick, onClick } = this.props;
		if (closeOnClick) {
			this.handleClose();
		}
		onClick();
	}

	render() {
		const { anchorEl } = this.state;
		const {
			icon: Icon, children, iconProps, onClick, ...props
		} = this.props;
		const open = Boolean(anchorEl);

		return (
			<Fragment>
				<IconButton
					aria-label="More"
					aria-haspopup="true"
					aria-owns={open ? 'long-menu' : undefined}
					onClick={this.handleClick}
					className="molecule_icon-menu"
					{...iconProps}
				>
					<Icon />
				</IconButton>
				<Menu
					id="long-menu"
					open={open}
					anchorEl={anchorEl}
					onClose={this.handleClose}
					onClick={this.onClick}
					PaperProps={{
						style: {
							width: 200,
						},
					}}
					{...props}
				>
					{children}
				</Menu>
			</Fragment>
		);
	}
}

IconMenu.propTypes = {
	icon: PropTypes.node,
	closeOnClick: PropTypes.bool,
	onClick: PropTypes.func,
};

IconMenu.defaultProps = {
	icon: MoreVert,
	closeOnClick: true,
	onClick: () => { },
};

export default IconMenu;
