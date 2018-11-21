import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
//import './styles.scss';

const Badge = ({ className, ...props }) =>
	<MUIBadge className={'atom_badge ' + className} {...props} />;

Badge.defaultProps = {
	className: '',
};
export default Badge;