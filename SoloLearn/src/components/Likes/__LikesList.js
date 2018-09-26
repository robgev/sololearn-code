import React from 'react';
import { observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import LikeItem from './LikeItem';

const LikesList = observer(({
	likes, hasMore, loadMore, onFollowClick,
}) => (
	likes.length === 0 && !hasMore
		? <div>Nothing found</div>
		: (
			<InfiniteScroll
				threshold={100}
				initialLoad={likes.length === 0}
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
				{likes.map(el =>
					<LikeItem key={el.id} user={el} onFollowClick={onFollowClick} />)}
			</InfiniteScroll>
		)
));

export default LikesList;
