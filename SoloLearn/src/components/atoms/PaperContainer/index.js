import React, { forwardRef } from 'react';
import Paper from '@material-ui/core/Paper';

import './styles.scss';

const PaperContainer = forwardRef(({ className, ...props }, ref) => (
	<Paper ref={ref} className={`atom_paper-container ${className}`} {...props} />
));

PaperContainer.defaultProps = {
	className: '',
};

export default PaperContainer;
