import React from 'react';
import { Container, ClickAwayListener } from 'components/atoms';

import './styles.scss';

const BluredBackground = ({
 children, clickAwayAction, mouseEvent = 'onMouseDown', ...props 
}) => (
	<React.Fragment>
		<Container className="molecule_background-blur" />
		<ClickAwayListener mouseEvent={mouseEvent} onClickAway={clickAwayAction} {...props}>
			<Container className="molecule_background-blur-inner-container" >
				{children}
			</Container>
		</ClickAwayListener>
	</React.Fragment>
);

export default BluredBackground;
