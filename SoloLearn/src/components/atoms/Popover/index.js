import React from 'react';
import { Tooltip } from 'react-tippy';

const Popover = ({ className, ...props }) =>
	(<Tooltip
		arrow
		interactive
		useContext
		tabIndex="0"
		theme="light"
		position="top-start"
		unmountHTMLWhenHide
		className={`atom_popover ${className}`}
		{...props}
	/>);

Popover.defaultProps = {
	className: '',
};
export default Popover;
