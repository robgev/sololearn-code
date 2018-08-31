import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';

const StylesDialog = ({ header = <div />, contentStyle, children, onRequestClose, ...rest }) => (
	<Dialog
		bodyStyle={{ padding: '0 0 0 5' }}
		contentStyle={{ maxWidth: 'none', width: '40%', ...contentStyle }}
		onRequestClose={onRequestClose}
		{...rest}
	>
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			<div>
				{header}
			</div>
			<IconButton className="close" onClick={onRequestClose}>
				<Close color={grey600} />
			</IconButton>
		</div>
		<div>
			{children}
		</div>
	</Dialog>
);

StylesDialog.defaultProps = {
	contentStyle: {},
};

export default StylesDialog;
