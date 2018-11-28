import React from 'react';
import BusyWrapper from 'components/BusyWrapper';
import SlayHomeShimmer from 'components/Shimmers/SlayHomeShimmer';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { InfiniteScroll, Layout, LayoutWithSidebar } from 'components/molecules';

const LayoutGenerator = ({
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
}) => {
	const MainContainer = noSidebar ? Layout : LayoutWithSidebar;
	return (
		<MainContainer
			sidebar={loading ? <SidebarShimmer /> : sidebarContent}
		>
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
		</MainContainer>
	);
};

export default LayoutGenerator;
