import React from 'react';
import { Link } from 'react-router';
import { FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

const AddQuestionButton = () => (
	<Link style={{ textDecoration: 'none' }} to="/discuss/new">
		<FloatingActionButton
			style={{
				position: 'fixed',
				bottom: 20,
				right: 20,
			}}
			zDepth={3}
			secondary
		>
			<ContentAdd />
		</FloatingActionButton>
	</Link>
);

export default AddQuestionButton;
