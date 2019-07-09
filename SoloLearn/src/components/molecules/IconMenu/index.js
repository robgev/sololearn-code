import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popper, Grow, ClickAwayListener, PaperContainer, MenuList } from 'components/atoms';
import { MoreVert } from 'components/icons';
import './styles.scss';

class IconMenu extends Component {
	state = {
		anchorEl: null,
	};

	handleClick = (event) => {
		const open = Boolean(this.state.anchorEl);
		if (open) {
			this.setState({ anchorEl: null });
		} else {
			this.setState({ anchorEl: event.currentTarget });
		}
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
			icon: Icon, children, iconProps, onClick, className, iconClassName, ...props
		} = this.props;
		const open = Boolean(anchorEl);

		return (
			<Fragment>
				<IconButton
					aria-label="More"
					aria-haspopup="true"
					aria-owns={open ? 'long-menu' : undefined}
					onClick={this.handleClick}
					className={`molecule_icon-menu ${iconClassName}`}
					{...iconProps}
				>
					<Icon />
				</IconButton>
				<Popper open={open} className="molecule_icon-menu-popper" anchorEl={anchorEl} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							className={`grow ${className} ${placement === 'bottom' ? 'top' : 'bottom'}`}
						>
							<PaperContainer>
								<ClickAwayListener onClickAway={this.handleClose}>
									<MenuList onClick={this.onClick} className="list" {...props}>
										{children}
									</MenuList>
								</ClickAwayListener>
							</PaperContainer>
						</Grow>
					)}
				</Popper>
			</Fragment>
		);
	}
}

IconMenu.propTypes = {
	icon: PropTypes.func,
	closeOnClick: PropTypes.bool,
	onClick: PropTypes.func,
};

IconMenu.defaultProps = {
	icon: MoreVert,
	closeOnClick: true,
	onClick: () => { },
};

export default IconMenu;
