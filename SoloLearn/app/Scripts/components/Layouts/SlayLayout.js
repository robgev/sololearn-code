import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BusyWrapper from 'components/Shared/BusyWrapper';
import CircularProgress from 'material-ui/CircularProgress';
import SlayHomeShimmer from 'components/Shared/Shimmers/SlayHomeShimmer';

import 'styles/slayBase.scss';

const Layout = ({
	style,
	items,
	loading,
	children,
	hasMore,
	loadMore,
	isCourses,
	cardComponent: CardComponent,
}) => (
	<div className="slay-container">
		<div className="main-content">
			<BusyWrapper
				isBusy={loading}
				loadingComponent={<SlayHomeShimmer />}
			>
				<InfiniteScroll
					pageStart={0}
					hasMore={hasMore}
					loadMore={loadMore}
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						...style,
					}}
					loader={loading ? null : <CircularProgress />}
					// Loading specifies initial load.
					// We don't want infinite scroll loading thing on inital load
				>
					{items.map(collection => (
						<CardComponent
							{...collection}
							isCourses={isCourses}
							key={collection.name}
						/>
					))}
				</InfiniteScroll>
				{children}
			</BusyWrapper>
		</div>
		<div className="sidebar-placeholder">
			<div className="sidebar" />
		</div>
	</div>
);

export default Layout;
