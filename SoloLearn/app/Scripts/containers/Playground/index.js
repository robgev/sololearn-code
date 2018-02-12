// React modules
import React from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import Playground from './Playground';

const PlaygroundRoute = ({ params }) => (
	<Layout>
		<Playground
			params={params}
			withBottomToolbar
			basePath="/playground"
		/>
	</Layout>
);

export default PlaygroundRoute;
