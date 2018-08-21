import React from 'react';
import Loadable from 'react-loadable';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = () => (
	<CircularProgress
		size={40}
		style={{
			display: 'flex',
			alignItems: 'center',
			margin: 'auto',
		}}
	/>
);

export default ({ loader }) => Loadable({ loader, loading: Loading });
