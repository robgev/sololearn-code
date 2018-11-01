import React from 'react';
import MUITabs from '@material-ui/core/Tabs';

const Tabs = ({ className, ...props }) => (
	<MUITabs fullWidth {...props} />
);

Tabs.defaultProps = {
	className: '',
};

export default Tabs;
