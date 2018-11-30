import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import { Layout } from 'components/molecules';
import RaisedButton from 'material-ui/RaisedButton';

const NotFound = () => (
	<Layout>
		<Paper style={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-around',
			alignItems: 'center',
			height: '50vh',
			padding: 15,
		}}
		>
			<div className="flex-centered column">
				<h1>Oops!</h1>
				<h3>404 Not Found</h3>
				<p>Sorry, an error has occured. Requested page not found</p>
			</div>
			<Link to="/">
				<RaisedButton
					labelColor="#fff"
					label="Back to Home"
					backgroundColor="#8bc34a"
				/>
			</Link>
		</Paper>
	</Layout>
);

export default NotFound;

// rootStyle={{ { paddingTop: 0 }}
