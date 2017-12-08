import React from 'react';
import { grey500 } from 'material-ui/styles/colors';
import ViewsIcon from 'material-ui/svg-icons/image/remove-red-eye';
import CommentsIcon from 'material-ui/svg-icons/communication/comment';

const ViewStats = ({ views, comments }) => (
	<div className="view-stats">
		<div className="stat-group">
			<ViewsIcon color={grey500} />
			<p>{ views }</p>
		</div>
		<div className="stat-group">
			<CommentsIcon color={grey500} />
			<p>{ comments }</p>
		</div>
	</div>
);

export default ViewStats;
