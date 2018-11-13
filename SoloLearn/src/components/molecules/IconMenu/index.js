import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu } from 'components/atoms';
import { MoreVert } from 'components/icons';

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

	render() {
		const { anchorEl } = this.state;
		const {
			icon: Icon, children, iconProps, ...props
		} = this.props;
		const open = Boolean(anchorEl);

		return (
			<Fragment>
				<IconButton
					aria-label="More"
					aria-haspopup="true"
					aria-owns={open ? 'long-menu' : undefined}
					onClick={this.handleClick}
					{...iconProps}
				>
					<Icon />
				</IconButton>
				<Menu
					id="long-menu"
					open={open}
					anchorEl={anchorEl}
					onClose={this.handleClose}
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
};

IconMenu.defaultProps = {
	icon: MoreVert,
};

export default IconMenu;
