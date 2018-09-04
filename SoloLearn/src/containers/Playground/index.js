// React modules
import React from 'react';
import LoadingOverlay from 'components/LoadingOverlay';
import Playground from './AsyncPlayground';

const PlaygroundRoute = ({ params, location }) => (
	<Playground
		params={params}
		withTopToolbar
		query={location.query}
		basePath="/playground"
		loadingComponent={<LoadingOverlay />}
	/>
);

export default PlaygroundRoute;
