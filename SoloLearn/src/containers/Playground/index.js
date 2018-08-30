// React modules
import React from 'react';
import 'styles/Playground/SplitPaneStyles.scss';
import Playground from './AsyncPlayground';

const PlaygroundRoute = ({ params, location }) => (
	<Playground
		params={params}
		withTopToolbar
		query={location.query}
		basePath="/playground"
	/>
);

export default PlaygroundRoute;
