import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import FollowItem from './FollowItem';
import { Container } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules'

const UserList = observer(({
	t, users, hasMore, loadMore, loading, onFollowClick,
}) => (
	users.length === 0 && !hasMore
		? <Container className="followers-popup-empty-text">{t('common.empty-list-message')}</Container>
		: (
			<InfiniteScroll
				useWindow={false}
				loadMore={loadMore}
				hasMore={hasMore}
				isLoading={loading}
				
			>
				{users.map(el =>
					<FollowItem key={el.id} follow={el} onFollowClick={onFollowClick} />)}
			</InfiniteScroll>
		)
));

export default translate()(UserList);
