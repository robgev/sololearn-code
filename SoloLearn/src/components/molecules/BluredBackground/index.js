import React, { Fragment } from 'react';
import { Container, ClickAwayListener } from 'components/atoms';
import PropTypes from 'prop-types';

import './styles.scss';

const BluredBackground = ({
	children, clickAwayAction, mouseEvent, ...props
}) => (
	<Fragment>
		<Container className="molecule_background-blur" />
		<ClickAwayListener mouseEvent={mouseEvent} onClickAway={clickAwayAction} {...props}>
			<Container className="molecule_background-blur-inner-container" >
				{children}
			</Container>
		</ClickAwayListener>
	</Fragment>
);

BluredBackground.defaultProps = {
	clickAwayAction: () => {},
	mouseEvent: 'onMouseDown',
};

BluredBackground.propTypes = {
	clickAwayAction: PropTypes.func,
	mouseEvent: PropTypes.string,
};

export default BluredBackground;
