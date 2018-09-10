import React from 'react';
import { numberFormatter } from 'utils';
import { grey500 } from 'material-ui/styles/colors';
import ViewsIcon from 'material-ui/svg-icons/image/remove-red-eye';
import CommentsIcon from 'material-ui/svg-icons/communication/comment';

const ViewStats = ({
	color, views, comments, iconStyle,
}) => (
	<div className="view-stats">
		{ views > 0 &&
			<div className="stat-group">
				<ViewsIcon color={color || grey500} style={{ height: 20, width: 20, ...iconStyle }} />
				<p>{ numberFormatter(views) }</p>
			</div>
		}
		{ comments > 0 &&
			<div className="stat-group">
				<CommentsIcon color={color || grey500} style={{ height: 20, width: 20, ...iconStyle }} />
				<p>{ numberFormatter(comments) }</p>
			</div>
		}
	</div>
);

export default ViewStats;
