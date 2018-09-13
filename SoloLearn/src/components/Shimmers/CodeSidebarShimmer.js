import React from 'react';
import 'styles/components/Shimmers/CodeSidebarShimmer.scss';

const CodeSidebarShimmer = ({ round }) => (
	<div className="code-sidebar-shimmer-wrapper">
		{Array(10).fill(0).map((_, i) => (
			<div className="code-sidebar-shimmer-container" key={i}>
				<div className={`code-sidebar-picture ${round ? 'round' : ''}`} />
				<div className="code-sidebar-info">
					<div className="code-sidebar-line long" />
					<div className="code-sidebar-line short" />
				</div>
				<div className="code-sidebar-shimmer-shimmer" />
			</div>
		))}
	</div>
);

export default CodeSidebarShimmer;
