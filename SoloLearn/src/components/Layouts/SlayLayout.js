import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import Sidebar from 'components/Sidebar';
import BusyWrapper from 'components/BusyWrapper';
import SlayHomeShimmer from 'components/Shimmers/SlayHomeShimmer';

import 'styles/slayBase.scss';

const Layout = ({
	title,
	style,
	paper,
	items,
	loading,
	children,
	hasMore,
	loadMore,
	isCourses,
	noDisplay,
	noSidebar,
	wrapperStyle,
	sidebarContent,
	cardComponent: CardComponent,
	loadingComponent: LoadingComponent,
}) => (
	<div className="slay-container">
		<div className={`main-content ${noSidebar ? 'wide' : ''}`}>
			<BusyWrapper
				title={title}
				paper={paper}
				isBusy={loading}
				style={wrapperStyle}
				noDisplay={noDisplay}
				loadingComponent={LoadingComponent ?
					<LoadingComponent /> :
					<SlayHomeShimmer />
				}
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
					loader={loading ?
						null :
						<CircularProgress
							style={{
								width: '100%',
								paddingBottom: 15,
								textAlign: 'center',
							}}
							key={items.length ? items[0].name : 'progress'}
						/>
					}
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
		{!noSidebar &&
			<Sidebar>
				{sidebarContent}
			</Sidebar>
		}
	</div>
);

export default Layout;
