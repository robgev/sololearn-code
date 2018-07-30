import React from 'react';
import 'styles/components/Shimmers/CodeShimmer.scss';

const CodeShimmer = () => (
	<div className="code-shimmer-root">
		{Array(20).fill(0).map((_, i) => (
			<div className="code-shimmer-container" key={i}>
				<div className="avatar" />
				<div className="code-text-info">
					<div className="code-line long" />
					<div className="code-line short" />
				</div>
				<div className="code-shimmer-shimmer" />
			</div>
		))}
	</div>
);

export default CodeShimmer;
