import React from 'react';
import Paper from 'material-ui/Paper';
import 'styles/components/Shared/Shimmers/FeedShimmer.scss';

const FeedShimmer = () => {
	const renderContainers = Array(20).fill(0).map((_, i) => (
		<Paper style={{
			height: 150,
			padding: 10,
			marginBottom: 10,
			position: 'relative',
			marginTop: i === 0 ? 10 : 0,
		}}
		>
			<div className="feed-shimmer-container" key={i}>
				<div className="post-head">
					<div className="avatar" />
					<div className="post-meta-info">
						<div className="post-name" />
						<div className="post-subhead" />
					</div>
				</div>
				<div className="post-body">
					<div className="post-line medium" />
					<div className="post-line long" />
					<div className="post-line short" />
				</div>
				<div className="post-footer">
					<div className="date" />
				</div>
			</div>
			<div className="feed-shimmer-shimmer" />
		</Paper>
	));
	return (
		<div>
			{renderContainers}
		</div>
	);
};

export default FeedShimmer;
