import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const FloatingButton = ({ onClick }) => (
	<div style={{
		position: 'absolute',
		width: 56,
		top: 0,
		bottom: 0,
		right: 20,
		zIndex: 1,
	}}
	>
		<FloatingActionButton
			secondary
			zDepth={3}
			style={{
				position: 'fixed',
				bottom: 25,
			}}
			onClick={onClick}
		>
			<ContentAdd />
		</FloatingActionButton>
	</div>
);

export default FloatingButton;
