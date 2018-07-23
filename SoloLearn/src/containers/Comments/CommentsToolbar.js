import React from 'react';
import { translate } from 'react-i18next';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

const CommentsToolbar = ({ value, onChange, t }) => (
	<DropDownMenu
		value={value}
		onChange={(_, __, val) => onChange(val)}
	>
		<MenuItem value={2} primaryText={t('comments.filter.most-popular')} />
		<MenuItem value={1} primaryText={t('comments.filter.most-recent')} />
	</DropDownMenu>
);

export default translate()(CommentsToolbar);
