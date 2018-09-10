import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';

const StylesDialog = ({
	header = <div />, contentStyle, children, onRequestClose, ...rest
}) => (
	<Dialog
		bodyStyle={{ padding: '0 0 0 5' }}
		contentStyle={{
			position: 'relative',
			maxWidth: 'none',
			width: '40%',
			...contentStyle,
		}}
		onRequestClose={onRequestClose}
		{...rest}
	>
		<IconButton
			className="close"
			onClick={onRequestClose}
			style={{ position: 'absolute', top: -5, right: -5 }}
		>
			<Close color={grey600} />
		</IconButton>
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<div>
				{header}
			</div>
		</div>
		<div style={{ padding: '10px 20px 20px 20px' }}>
			{children}
		</div>
	</Dialog>
);

StylesDialog.defaultProps = {
	contentStyle: {},
};

export default StylesDialog;
