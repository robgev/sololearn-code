import React from 'react';
import { translate } from 'react-i18next';
import {
	Container,
	Heading,
} from 'components/atoms';
import {
	TitleTab,
} from 'components/molecules';

const CommentsToolbar = ({
	value, count, onChange, t,
}) => (
	<Container className="comments-toolbar-container">
		<Heading className="comments-heading">
			{count === 1
				? t('common.comment-format-one')
				: `${count} ${t('common.comments')}`}
		</Heading>
		<TitleTab
			activeTab={value}
			handleTabChange={onChange}
			tabs={[
				{ value: 2, text: t('comments.filter.most-popular') },
				{ value: 1, text: t('comments.filter.most-recent') },
			]}
		/>
	</Container>
);

export default translate()(CommentsToolbar);
