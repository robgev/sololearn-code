import React from 'react';
import 'styles/components/Shimmers/SidebarShimmer.scss';

const SidebarShimmer = ({ round }) => (
	<div className="sidebar-shimmer-wrapper">
		<div className="sidebar-title">
			<div className="sidebar-title-text" />
			<div className="sidebar-load-more" />
			<div className="sidebar-shimmer-shimmer" />
		</div>
		{Array(10).fill(0).map((_, i) => (
			<div className="sidebar-shimmer-container" key={i}>
				<div className={`sidebar-picture ${round ? 'round' : ''}`} />
				<div className="sidebar-info">
					<div className="sidebar-line long" />
					<div className="sidebar-line short" />
				</div>
				<div className="sidebar-shimmer-shimmer" />
			</div>
		))}
	</div>
);

export default SidebarShimmer;
