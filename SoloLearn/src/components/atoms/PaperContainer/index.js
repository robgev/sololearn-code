import React from 'react';
import Paper from '@material-ui/core/Paper';

import './styles.scss';

const PaperContainer = ({ className, ...props }) => (
	<Paper className={`atom_paper-container ${className}`} {...props} />
);

PaperContainer.defaultProps = {
	className: '',
};

export default PaperContainer;
