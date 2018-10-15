import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import FollowItem from './FollowItem';

const UserList = observer(({
	t, users, hasMore, loadMore, onFollowClick,
}) => (
	users.length === 0 && !hasMore
		? <div>{t('common.empty-list-message')}</div>
		: (
			<InfiniteScroll
				threshold={100}
				element="div"
				loader={<CircularProgress
					key="Infinite loader"
					size={40}
					style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
				/>}
				useWindow={false}
				loadMore={loadMore}
				hasMore={hasMore}
				style={{
					display: 'flex',
					width: '100%',
					flexDirection: 'column',
				}}
			>
				{users.map(el =>
					<FollowItem key={el.id} follow={el} onFollowClick={onFollowClick} />)}
			</InfiniteScroll>
		)
));

export default translate()(UserList);
