// React modules
import React from 'react';
import Playground from './Playground';

const PlaygroundRoute = ({ params }) => (
	<Playground
		params={params}
		withCodeComments
		basePath="/playground"
	/>
);

export default PlaygroundRoute;
