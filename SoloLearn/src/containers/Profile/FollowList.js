import React from 'react';
import { observer } from 'mobx-react';
import CircularProgress from 'material-ui/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import FollowItem from './FollowItem';

const FollowList = observer(({
	followers, hasMore, loadMore, onFollowClick,
}) => (
	followers.length === 0 && !hasMore
		? <div>Nothing found</div>
		: (
			<InfiniteScroll
				threshold={100}
				initialLoad={followers.length === 0}
				element="div"
				loader={<CircularProgress
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
				{followers.map(el =>
					<FollowItem key={el.id} follow={el} onFollowClick={onFollowClick}>Follower</FollowItem>)}
			</InfiniteScroll>
		)
));

export default FollowList;
