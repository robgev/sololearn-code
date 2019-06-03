import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import { Layout } from 'components/molecules';
import RaisedButton from 'material-ui/RaisedButton';

const ComingSoon = () => {
	document.title='Sololearn | Play'

	return 	<Layout>
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
				<h1>Under Construction</h1>
				<h3>Play page is not ready yet.</h3>
				<p>This page is under construction. It will be ready soon {';)'}</p>
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
};

export default ComingSoon;
