// React modules
import React from 'react';
import Playground from './Playground';

const PlaygroundRoute = ({ params, location }) => (
	<Playground
		params={params}
		withTopToolbar
		query={location.query}
		basePath="/playground"
	/>
);

export default PlaygroundRoute;
