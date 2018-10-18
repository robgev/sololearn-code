import React from 'react';
import { translate } from 'react-i18next';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

const CommentsToolbar = ({
	value, count, onChange, t,
}) => (
	<div className="comments-toolbar-container">
		<p className="page-title">
			{count === 1
				? t('common.comment-format-one')
				: `${count} ${t('common.comments')}`}
		</p>
		<DropDownMenu
			value={value}
			style={{ marginRight: -23 }}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			targetOrigin={{ vertical: 'top', horizontal: 'right' }}
			onChange={(_, __, val) => onChange(val)}
		>
			<MenuItem value={2} primaryText={t('comments.filter.most-popular')} />
			<MenuItem value={1} primaryText={t('comments.filter.most-recent')} />
		</DropDownMenu>
	</div>
);

export default translate()(CommentsToolbar);
