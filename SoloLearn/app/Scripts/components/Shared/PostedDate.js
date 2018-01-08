import React from 'react';
import { updateDate } from 'utils';

const PostedDate = ({ date, style }) => (
	<div style={{ fontSize: 12, ...style }}>
		<span>{updateDate(date)}</span>
	</div>
);

export default PostedDate;
