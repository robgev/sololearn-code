import React from 'react';
import { Link } from 'react-router';
import { FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

const AddQuestionButton = () => (
	<div style={{
		position: 'absolute',
		width: 56,
		top: 0,
		bottom: 0,
		right: 20,
		zIndex: 1,
	}}
	>
		<Link style={{ textDecoration: 'none' }} to="/discuss/new">
			<FloatingActionButton
				style={{
					position: 'fixed',
					bottom: 25,
				}}
				zDepth={3}
				secondary
			>
				<ContentAdd />
			</FloatingActionButton>
		</Link>
	</div>
);

export default AddQuestionButton;
