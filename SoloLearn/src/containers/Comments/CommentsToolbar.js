import React from 'react';
import { translate } from 'react-i18next';
import {
	Container,
	MenuItem,
	Select,
	Title,
} from 'components/atoms';

const CommentsToolbar = ({
	value, count, onChange, t,
}) => (
	<Container className="comments-toolbar-container">
		<Title>
			{count === 1
				? t('common.comment-format-one')
				: `${count} ${t('common.comments')}`}
		</Title>
		<Select
			value={value}
			onChange={event => onChange(event.target.value)}
		>
			<MenuItem value={2}>{t('comments.filter.most-popular')}</MenuItem>
			<MenuItem value={1}>{t('comments.filter.most-recent')}</MenuItem>
		</Select>
	</Container>
);

export default translate()(CommentsToolbar);
